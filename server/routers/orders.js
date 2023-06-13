import { Router } from 'express';
import Order from '../models/order.js';
import Customer from '../models/customer.js';
import Pizza from '../models/pizza.js';


const router = Router();

// Create a new order with customer, pizza, delivery and notes documents
router.post("/", async (request, response) => {
  try {
    const body = request.body;
    
    // Create the Order so that it can be populated
    const newOrder = new Order({});

    // Create and save the customer document in a seperate collection if it doesn't already exist
    let customer = await Customer.exists({_id: body.customer});
    if (customer === null) {
      customer = new Customer(body.customer);
      await customer.save();  
    }

    // Create and save the pizza documents in a seperate collection
    let pizzaIds = [];
    for (const pizza of body.pizzas) {
      // Add the order ID and customer ID to each pizza for cross reference purposes
      const newPizza = new Pizza({ ...pizza, order: newOrder._id, customer: customer._id });
      await newPizza.save();
      pizzaIds.push(newPizza._id);
    }

    // Define the references to order using the above created IDs
    newOrder.customer = customer._id;
    newOrder.pizzas = pizzaIds;

    // Define the nested documents
    newOrder.notes = body.notes;
    newOrder.status = body.status;

    // Create and save the order document in a seperate collection
    const data = await newOrder.save();
    
    response.json(data);
  } catch(error) {
    // Output error to the console incase it fails to send in response
    console.log(error);
    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
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
      data = await Order.find(query);
    } else {
      data = await Order.find(query)
        // Populate the customer and pizza documents from the IDs included in the order document
        .populate("customer")
        .populate("pizzas")
        .exec();
      }

      response.json(data);
  } catch(error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

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
    // Output error to the console incase it fails to send in response
    console.log(error);

    response.status(500).json(error.errors);
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

    response.json(data);
  } catch(error) {
    // Output error to the console incase it fails to send in response
    console.log(error);

    response.sendStatus(500).json(error);
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
    for (const pizza of data.pizzas) {
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
    }
    
    response.json(data);
  } catch(error) {
    // Output error to the console incase it fails to send in response
    console.log(error);
    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
    return response.status(500).json(error.errors);
  }
});

export default router;