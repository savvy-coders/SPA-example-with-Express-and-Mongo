import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Pizza from '../models/pizza.js';

import { Router } from 'express';

const router = Router();

// Create a new order with customer, pizza, delivery and notes documents
router.post("/", (request, response) => {
  const body = request.body;

  // Create the subdocuments
  const customer = new Customer(body.customer);
  customer.save();

  const newOrder = new Order({});

  const pizzaIds = body.pizzas.map(pizza => {
    const newPizza = new Pizza({ ...pizza, order: newOrder._id, customer: customer._id });
    newPizza.save();
    return newPizza._id;
  });

  newOrder.pizzas = pizzaIds;
  newOrder.customer = customer._id;
  newOrder.notes = body.notes;
  newOrder.status = body.status;

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

    Pizza
      .deleteMany()
      .where("_id")
      .in(data.pizzas)
      .exec(error => {
        if (error) return response.sendStatus(500).json(error);
      });

    Customer.findByIdAndRemove(data.customer, error => {
      if (error) return response.sendStatus(500).json(error);
    });

    return response.json(data);
  });
});

export default router;