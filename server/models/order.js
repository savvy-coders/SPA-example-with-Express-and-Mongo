import mongoose from "mongoose";
import Delivery from "./delivery.js";
import Note from "./note.js";

// Demonstrate linking vs embedding
const orderSchema = new mongoose.Schema({
  pizzas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pizza" }],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  delivery: Delivery.schema,
  notes: [Note.schema],
  status: String
});

const Order = mongoose.model("Order", orderSchema);

export default Order;