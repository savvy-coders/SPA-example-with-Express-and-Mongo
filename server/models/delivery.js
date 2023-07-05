import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  time: String,
  driver: String
});

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
