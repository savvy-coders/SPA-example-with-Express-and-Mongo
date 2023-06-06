import { Router } from 'express';
import Pizza from '../models/pizza.js';

const router = Router();

// Create pizza route
router.post("/", (request, response) => {
  const newPizza = new Pizza(request.body);
  newPizza.save((error, pizza) => {
    if (error && 'name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    if (error) return response.status(500).json(error.errors);

    response.json(pizza);
  });
});

// Get all pizzas route
router.get("/", (request, response) => {
  Pizza.find({}, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

// Get a single pizza by ID
router.get("/:id", (request, response) => {
  Pizza.findById(request.params.id, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

// Update a single pizza by ID
router.put("/:id", (request, response) => {
  const body = request.body;
  Pizza.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        crust: body.crust,
        cheese: body.cheese,
        sauce: body.sauce,
        toppings: body.toppings
      }
    },
    (error, data) => {
      if (error && 'name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
      if (error) return response.status(500).json(error.errors);

      response.json(data);
    }
  );
});

// Delete a pizza by ID
router.delete("/:id", (request, response) => {
  Pizza.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

export default router;