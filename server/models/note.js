import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  timestamp: String, // Could be Date as well, but used String to reduce complexity, not recommended
  note: String
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
