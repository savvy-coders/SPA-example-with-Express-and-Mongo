const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pizzaSchema = new mongoose.Schema({
  crust: String,
  cheese: String,
  sauce: String,
  toppings: [String],
  order: { type: Schema.Types.ObjectId, ref: "Order" }
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

module.exports = {
  model: Pizza,
  schema: pizzaSchema
};
