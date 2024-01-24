import mongoose from "mongoose";

// Demonstrate linking vs embedding
const orderSchema = new mongoose.Schema({
  pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pizza" }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;