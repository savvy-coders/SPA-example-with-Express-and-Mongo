import mongoose from "mongoose";
import Customer from "./customer.js";

const pizzaSchema = new mongoose.Schema({
  customer: {
    // Example use of a nested model
    // You can also use a referenced model if duplication of information is an issue
    //   https://mongoosejs.com/docs/populate.html
    type: Customer.schema,
    required: true
  },
  crust: {
    type: String,
    required: true,
    enum: ["Thin", "Hand Tossed", "Chicago", "Deep Dish"]
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
  toppings: [String]
});

const Pizza = mongoose.model("Pizza", pizzaSchema);

export default Pizza;