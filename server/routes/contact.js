const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const protect = require('../middleware/authMiddleware'); // Use the correct middleware

router.post("/", async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newMessage = new ContactMessage({ name, phone, message });
    await newMessage.save();
    res.status(201).json({ message: "Your message has been submitted!" });
  } catch (err) {
    console.error("Error saving contact message:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get all contact messages
router.get("/messages",protect, async (req, res) => {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

module.exports = router;
