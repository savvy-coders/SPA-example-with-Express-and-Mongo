import { Router } from 'express';
import mongoose from 'mongoose';
import Pizza from '../models/pizza';

const router = Router();

router.post("/", (request, response) => {
  const newPizza = new Pizza.model(request.body);
  newPizza.save((error, pizza) => {
    if (error && 'name' in error && error.name === 'ValidationError') return response.status(400).json(error.errors);
    if (error) return response.status(500).json(error.errors);

    response.json(pizza);
  });
});

router.get("/", (request, response) => {
  Pizza.model.find({}, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

router.get("/:id", (request, response) => {
  Pizza.model.findById(request.params.id, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

router.put("/:id", (request, response) => {
  const body = request.body;
  Pizza.model.findByIdAndUpdate(
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

router.delete("/:id", (request, response) => {
  Pizza.model.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.status(500).json(error.errors);

    response.json(data);
  });
});

module.exports = router;
