import express from "express";
import cors from "cors";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

// Load environment variables
config();

const app = express();
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const chat = require("./routes/chat");
const user = require("./routes/user");

app.use("/chat", chat);
app.use("/user", user);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// app.post("/chat", async (req, res) => {
//   const { messages } = req.body;
//   try {
//     const completion = await openaiConfig.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: messages,
//     });

//     console.log("OpenAI API response:", completion);
//     res.json({ data: completion.choices[0].message });
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error);
//     res.status(500).json({ error: "Failed to call OpenAI API" });
//   }
// });

const PORT = 3080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
