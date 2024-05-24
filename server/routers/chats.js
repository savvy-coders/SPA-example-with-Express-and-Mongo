import { Router } from "express";
import axios from "axios";
import Chat from "../models/chat.js";

const router = Router();

// Get all chat records from the database and return an empty object if there are no records
router.get("/", async (req, res) => {
  try {
    const data = await Chat.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new chat record in the database
router.post("/", async (req, res) => {
  const { userId } = req.body;

  const chat = new Chat({
    userId
  });

  try {
    const data = await chat.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { message } = req.body;
  const id = req.params.id;

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: message,
        temperature: 0.5,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const newMessage = {
      message,
      response: response.data.choices[0].text
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

