import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  postalCode: String
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
