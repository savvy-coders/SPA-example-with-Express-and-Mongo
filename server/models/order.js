import mongoose from "mongoose";
import delivery from "./delivery";
import note from "./note";

// Demonstrate linking vs embedding
const orderSchema = new mongoose.Schema({
  pizzas: [{ type: Schema.Types.ObjectId, ref: "Pizza" }],
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  delivery: delivery.schema,
  notes: [note.schema],
  status: String
});

const Order = mongoose.model("Order", orderSchema);

module.exports = {
  model: Order,
  schema: orderSchema
};
