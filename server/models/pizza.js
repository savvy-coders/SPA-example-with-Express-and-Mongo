const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pizzaSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  crust: {
    type: String,
    required: true,
    enum: ["thin", "chicago", "deep-dish", "hella-thick"]
  },
  cheese: {
    type: String,
    validate: /^[A-Za-z0-9 ]*$/
  },
  sauce: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  toppings: [String],
  order: { type: Schema.Types.ObjectId, ref: "Order" }
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = {
  model: Pizza,
  schema: pizzaSchema
};
