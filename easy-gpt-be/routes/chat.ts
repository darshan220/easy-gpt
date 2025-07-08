import express from "express";
const router = express.Router();
import { appConfig } from "../config/app.config";

router.post("/get-response", async (req: any, res: any) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing 'messages' array" });
  }

  try {
    const groqResponse = await fetch(appConfig.groqConfig.apiUrl ?? "", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${appConfig.groqConfig.apiKey}`,
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
    //TODO:- pass only data 
    res.json(data);
  } catch (err: any) {
    console.error("Groq API error:", err);
    res.status(500).json({
      error: "Groq API call failed",
      details: err.message,
    });
  }
});

module.exports = router;
