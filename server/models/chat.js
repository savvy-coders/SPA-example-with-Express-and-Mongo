import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String
  }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

