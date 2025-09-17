import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default test route
app.get("/", (req, res) => {
  res.send("✅ Backend + Gemini is working!");
});

// Itinerary route
app.post("/api/plan", async (req, res) => {
  try {
    const { name, ethnicity, budget, interests, duration, state } = req.body;

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });

    const prompt = `
    You are a travel planner.
    Create a detailed ${duration}-day travel itinerary for ${name}.
    State: ${state}.
    Budget: ₹${budget}.
    Ethnicity: ${ethnicity}.
    Interests: ${interests.join(", ")}.
    Give me the plan day by day in clear bullet points.
    `;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ itinerary: reply });
  } catch (err) {
    console.error("Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate travel plan" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend with Gemini running on http://localhost:${PORT}`);
});

