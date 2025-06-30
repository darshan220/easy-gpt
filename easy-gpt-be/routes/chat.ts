import express from "express";
const router = express.Router();
import { GROQ_API_KEY, GROQ_API_URL } from "../config/openaiConfig";

router.post("/get-response", async (req: any, res: any) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'messages' array" });
  }

  try {
    const groqResponse = await fetch(GROQ_API_URL ?? "" , {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages,
      }),
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      console.error("Groq API error:", errorData);
      return res.status(500).json({
        error: "Groq API call failed",
        details: errorData,
      });
    }

    const data = await groqResponse.json();
    res.json({ data: data.choices[0].message.content });
  } catch (err: any) {
    console.error("Groq API error:", err);
    res.status(500).json({
      error: "Groq API call failed",
      details: err.message,
    });
  }
});

module.exports = router;
