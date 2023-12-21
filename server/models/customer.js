import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  },
  name: String
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
