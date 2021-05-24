const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Customer = require("../models/customer");
const Pizza = require("../models/pizza");

// Create a new order with customer, pizza, delivery and notes documents
router.post("/", (request, response) => {
  const body = request.body;

  // Create the subdocuments
  const customer = new Customer.model(body.customer);
  customer.save();

  const newOrder = new Order.model({});

  const pizzaIds = body.pizzas.map(pizza => {
    const newPizza = new Pizza.model({ ...pizza, order: newOrder._id });
    newPizza.save();
    return newPizza._id;
  });

  newOrder.pizzas = pizzaIds;
  newOrder.customer = customer._id;
  newOrder.notes = body.notes;
  newOrder.status = body.status;

  newOrder.save((error, data) => {
    return error ? response.sendStatus(500).json(error) : response.json(data);
  });
});

// Retrieve a single order with the option to not populate the subdocuments
router.get("/:id", (request, response) => {
  // Request parameters (params) are defined in the route, queryParams are provided after the url behind a ? and & in key=value pairs
  const params = request.params;
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.model.findById(params.id, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order.model
      .findById(params.id)
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        return error
          ? response.sendStatus(500).json(error)
          : response.json(data);
      });
  }
});

// Retrieve all orders with the option to not populate the subdocuments
router.get("/", (request, response) => {
  const query = request.query;
  if (query.hasOwnProperty("raw") && query.raw === "true") {
    Order.model.find({}, (error, data) => {
      return error ? response.sendStatus(500).json(error) : response.json(data);
    });
  } else {
    Order.model
      .find({})
      .populate("customer")
      .populate("pizzas")
      .exec((error, data) => {
        return error
          ? response.sendStatus(500).json(error)
          : response.json(data);
      });
  }
});

// Update a single orders pizza, delivery and notes subdocuments
router.put("/:id", (request, response) => {
  const data = request.body;
  Order.model.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        delivery: data.delivery,
        notes: data.notes
      }
    },
    (error, data) => {
      data.pizzas.forEach(pizza => {
        Pizza.model.findByIdAndUpdate(
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

      return error ? response.sendStatus(500).json(error) : res.json(data);
    }
  );
});

// Remove a single order and it's subdocuments
router.delete("/:id", (request, response) => {
  Order.model.findByIdAndDelete(request.params.id, {}, (error, data) => {
    if (error) response.sendStatus(500).json(error);

    Pizza.model
      .deleteMany()
      .where("_id")
      .in(data.pizzas)
      .exec(error => {
        if (error) return response.sendStatus(500).json(error);
      });

    Customer.model.findByIdAndRemove(data.customer, error => {
      if (error) return response.sendStatus(500).json(error);
    });

    return response.json(data);
  });
});

module.exports = router;
