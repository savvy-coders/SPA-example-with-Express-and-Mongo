import { Router } from "express";
import axios from "axios";
import Chat from "../models/chat.js";

const router = Router();

// Get all chat records from the database and return an empty object if there are no records
router.get("/", async (req, res) => {
  try {
    console.log("Incoming GET request to /chats");
    const query = req.query;

    const data = await Chat.find(query);
    console.log(`Returning ${data.length} chat records`);
    res.json(data);
  } catch (error) {
    console.error(`Error in GET request to /chats: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Create a new chat record in the database
router.post("/", async (req, res) => {
  console.log("Incoming POST request to /chats");
  const userId = req.body.userId;
  const message = req.body.message;
  const response = req.body.response;

  const chat = new Chat({
    userId,
    message,
    response
  });

  try {
    const data = await chat.save();
    console.log(`Saved new chat record with ID ${data._id}`);
    res.json(data);
  } catch (error) {
    console.error(`Error in POST request to /chats: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  console.log("Incoming PUT request to /chats/:id");
  const { message } = req.body.message;
  const id = req.params.id;

  try {
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    // Send the message to the OpenAI API
    const openAIResponse = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: message,
        temperature: 0.5,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        documents: await axios.get(`${PIZZA_PLACE_API_URL}/pizzas`)
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Package the data to be sent to the /chats database
    const newMessage = {
      userId: chat.userId,
      message: chat.message,
      response: openAIResponse.data.choices[0].text
    };

    chat.conversations.push(newMessage);
    await chat.save();

    console.log(`Updated chat with ID ${id} and saved new message`);
    res.json(chat);
  } catch (error) {
    console.error(`Error in PUT request to /chats/:id: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

export default router;

