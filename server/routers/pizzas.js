const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Pizza = require("../models/pizza");

router.post("/", (request, response) => {
  const newPizza = new Pizza(request.body);
  newPizza.save((err, pizza) => {
    return err ? response.sendStatus(500).json(err) : response.json(pizza);
  });
});

router.get("/", (request, response) => {
  Pizza.find({}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

router.get("/:id", (request, response) => {
  Pizza.findById(request.params.id, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

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
      if (error) return response.sendStatus(500).json(error);
      return response.json(request.body);
    }
  );
});

router.delete("/:id", (request, response) => {
  Pizza.findByIdAndRemove(request.params.id, {}, (error, data) => {
    if (error) return response.sendStatus(500).json(error);
    return response.json(data);
  });
});

module.exports = router;
