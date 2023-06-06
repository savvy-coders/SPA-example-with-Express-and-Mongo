import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Pizza from '../models/pizza.js';

import { Router } from 'express';

const router = Router();

// Create a new order with customer, pizza, delivery and notes documents
router.post("/", (request, response) => {
  const body = request.body;

  // Create and save the customer document in a seperate collection
  const customer = new Customer(body.customer);
  customer.save();

  // Create the 
  const newOrder = new Order({});

  // Create and save the pizza documents in a seperate collection
  const pizzaIds = body.pizzas.map(pizza => {
    // Add the order ID and customer ID to each pizza for cross reference purposes
    const newPizza = new Pizza({ ...pizza, order: newOrder._id, customer: customer._id });
    newPizza.save();
    return newPizza._id;
  });

  // Define the order using the above created IDs
  newOrder.pizzas = pizzaIds;
  newOrder.customer = customer._id;
  newOrder.notes = body.notes;
  newOrder.status = body.status;

  // Create and save the order document in a seperate collection
  newOrder.save((error, data) => {
    if (error && 'name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

// Retrieve a single order with the option to not populate the subdocuments
router.get("/:id", (request, response) => {
  // Request parameters (params) are defined in the route, queryParams are provided after the url behind a ? and & in key=value pairs
  const params = request.params;
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.findById(params.id, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order
      .findById(params.id)
      // Populate the customer and pizza documents from the IDs included in the order document
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        if (error) return response.status(500).json(error.errors);
    
        response.json(data);
      });
  }
});

// Retrieve all orders with the option to not populate the subdocuments
router.get("/", (request, response) => {
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.find({}, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order
      .find({})
      // Populate the customer and pizza documents from the IDs included in the order document
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        if (error) return response.status(500).json(error.errors);

        response.json(data);
      });
  }
});

// Update a single orders pizza, delivery and notes subdocuments
router.put("/:id", (request, response) => {
  const data = request.body;
  Order.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        delivery: data.delivery,
        notes: data.notes
      }
    },
    (error, data) => {
      // Iterate over the pizzas in the request and update as needed
      data.pizzas.forEach(pizza => {
        Pizza.findByIdAndUpdate(
          pizza._id,
          {
            $setOnInsert: {
              crust: pizza.crust,
              cheese: pizza.cheese,
              sauce: pizza.sauce,
              toppings: pizza.toppings,
              order: pizza.order
            }
          },
          { upsert: true, new: true },
          error => {
            return response.sendStatus(500).json(error);
          }
        );
      });

      if (error && 'name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
      if (error) return response.status(500).json(error.errors);

      response.json(data);
    }
  );
});

// Remove a single order and it's subdocuments
router.delete("/:id", (request, response) => {
  Order.findByIdAndDelete(request.params.id, {}, (error, data) => {
    if (error) response.sendStatus(500).json(error);

    // Remove the related pizza documents
    Pizza
      .deleteMany()
      .where("_id")
      .in(data.pizzas)
      .exec(error => {
        if (error) return response.sendStatus(500).json(error);
      });

    // Remove the related customer document
    Customer.findByIdAndRemove(data.customer, error => {
      if (error) return response.sendStatus(500).json(error);
    });

    return response.json(data);
  });
});

export default router;