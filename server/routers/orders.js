import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Pizza from '../models/pizza.js';

import { Router } from 'express';

const router = Router();

// Create a new order with customer, pizza, delivery and notes documents
router.post("/", async (request, response) => {
  const body = request.body;

  try {
    // Create and save the customer document in a seperate collection
    const customer = new Customer(body.customer);
    await customer.save();
  } catch(error) {
    console.log(`Error saving customer ${body.customer.name}`);
  }

  // Create the 
  const newOrder = new Order({});

  // Create and save the pizza documents in a seperate collection
  try {
    const pizzaIds = body.pizzas.map(async pizza => {  
      // Add the order ID and customer ID to each pizza for cross reference purposes
      const newPizza = new Pizza({ ...pizza, order: newOrder._id, customer: customer._id });
        await newPizza.save();
        return newPizza._id;
    });
  } catch(error) {
    console.log(`Error saving pizzas`);
  }

  try {
    // Define the order using the above created IDs
    newOrder.pizzas = pizzaIds;
    newOrder.customer = customer._id;
    newOrder.notes = body.notes;
    newOrder.status = body.status;

    // Create and save the order document in a seperate collection
    const data = await newOrder.save();
    
    response.json(data);
  } catch(error) {
    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
    response.status(500).json(error.errors);
  }
});

// Retrieve a single order with the option to not populate the subdocuments
router.get("/:id", async (request, response) => {
  try {
    const params = request.params;
    const query = request.query;
    
    let data;
    
    // Request parameters (params) are defined in the route, queryParams are provided after the url behind a ? and & in key=value pairs
    if ("raw" in query && query.raw === "true") {
      data = await Order.findById(params.id);
    } else {
      data = await Order.findById(params.id)
        // Populate the customer and pizza documents from the IDs included in the order document
        .populate("customer")
        .populate("pizzas")
        .exec();
      }
      
      response.json(data);
  } catch(error) {
    response.status(500).json(error.errors);
  }
});

// Retrieve all orders with the option to not populate the subdocuments
router.get("/", async (request, response) => {
  try {
    const query = request.query;

    let data;

    // We can't check for a boolean as query strings are passed as strings
    if ("raw" in query && query.raw === "true") {
      data = await Order.find({});
    } else {
      data = await Order.find({})
        // Populate the customer and pizza documents from the IDs included in the order document
        .populate("customer")
        .populate("pizzas")
        .exec();
      }

      response.json(data);
  } catch(error) {
    response.status(500).json(error.errors);
  }
});

// Update a single orders pizza, delivery and notes subdocuments
router.put("/:id", async (request, response) => {
  try {
    const body = request.body;

    const data = await Order.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          delivery: body.delivery,
          notes: body.notes
        }
      },
      { 
        new: true
      }
    );

    // Iterate over the pizzas in the request and update as needed
    data.pizzas.forEach(async pizza => {
      await Pizza.findByIdAndUpdate(
        pizza._id,
        {
          $setOnInsert: {
            crust: pizza.crust,
            cheese: pizza.cheese,
            sauce: pizza.sauce,
            toppings: pizza.toppings,
            order: pizza.order
          }
        }
      );
    });
    
    response.json(data);
  } catch(error) {
    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
    return response.status(500).json(error.errors);
  }
});

// Remove a single order and it's subdocuments
router.delete("/:id", async (request, response) => {
  try {
    const data = await Order.findByIdAndDelete(request.params.id, {})
      .populate('pizzas')
      .populate('customer')
      .exec();

    // Remove the related pizza documents
    await Pizza
      .deleteMany()
      .where("_id")
      .in(data.pizzas)
      .exec();

    // Remove the related customer document
    await Customer.findByIdAndRemove(data.customer);

    return response.json(data);
  } catch(error) {
    response.sendStatus(500).json(error);
  }
});

export default router;