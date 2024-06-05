import { Router } from 'express';
import Pizza from '../models/pizza.js';

const router = Router();

// Create pizza route
router.post("/", async (request, response) => {
  try {
    console.log('Creating a new Pizza:', request.body);
    const newPizza = new Pizza(request.body);
    
    const data = await newPizza.save();
    console.log('Pizza created successfully:', data);

    response.json(data);
  } catch(error) {
    console.log('Error creating a new Pizza:', error);
    // Output error to the console in case it fails to send in response
    console.log(error);
    
    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
    return response.status(500).json(error.errors);
  }
});

// Get all pizzas route
router.get("/", async (request, response) => {
  try {
    // Store the query params into a JavaScript Object
    const query = request.query;
    console.log('Querying for all Pizzas:', query);

    const data = await Pizza.find(query);
    console.log('Pizzas found successfully:', data);

    response.json(data);
  } catch(error) {
    console.log('Error querying for all Pizzas:', error);
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Get a single pizza by ID
router.get("/:id", async (request, response) => {
  try {
    const pizzaId = request.params.id;
    console.log('Querying for Pizza by ID:', pizzaId);

    const data = await Pizza.findById(request.params.id);
    console.log('Pizza found successfully:', data);

    response.json(data);
  } catch(error) {
    console.log('Error querying for Pizza by ID:', error);
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

// Update a single pizza by ID
router.put("/:id", async (request, response) => {
  try {
    const pizzaId = request.params.id;
    const body = request.body;
    console.log('Updating Pizza by ID:', pizzaId, 'with data:', body);

    const data = await Pizza.findByIdAndUpdate(
      request.params.id,
      {
        $set: {
          crust: body.crust,
          cheese: body.cheese,
          sauce: body.sauce,
          toppings: body.toppings
        }
      },
      {
        new: true
      }
    );
    console.log('Pizza updated successfully:', data);

    response.json(data);
  } catch(error) {
    console.log('Error updating Pizza by ID:', error);
    // Output error to the console in case it fails to send in response
    console.log(error);

    if ('name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    
    return response.status(500).json(error.errors);
  }
});

// Delete a pizza by ID
router.delete("/:id", async (request, response) => {
  try {
    const pizzaId = request.params.id;
    console.log('Deleting Pizza by ID:', pizzaId);

    const data = await Pizza.findByIdAndRemove(request.params.id, {});
    console.log('Pizza deleted successfully:', data);

    response.json(data);
  } catch(error) {
    console.log('Error deleting Pizza by ID:', error);
    // Output error to the console in case it fails to send in response
    console.log(error);

    return response.status(500).json(error.errors);
  }
});

export default router;
