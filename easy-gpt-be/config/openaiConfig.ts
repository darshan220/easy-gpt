import "dotenv/config";
import OpenAI from "openai";

const openaiConfig = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

export { openaiConfig, GROQ_API_KEY, GROQ_API_URL, JWT_SECRET };
