const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();


const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;


const openai = new OpenAI({
  baseURL: DEEPSEEK_API_URL,
  apiKey: DEEPSEEK_API_KEY,
});


router.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log("Prompt received:", prompt);

     const completion = await openai.chat.completions.create({
       messages: [{ role: "system", content: prompt }],
       model: "deepseek-chat",
     });

    res.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error calling Deepseek Coder API:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

module.exports = router;
