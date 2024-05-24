import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  message: {
    type: String,
    required: true,
    validate: /^[A-Za-z0-9 ]*$/
  },
  response: {
    type: String,
    validate: /^[A-Za-z0-9 ]*$/
  }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;