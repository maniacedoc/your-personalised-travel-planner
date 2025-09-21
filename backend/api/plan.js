// server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/plan", async (req, res) => {
  try {
    const { name, ethnicity, budget, interests, duration, state } = req.body;

    // Step 1: Generate itinerary using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are a travel planner.
      Create a detailed ${duration}-day travel itinerary for ${name}.
      State: ${state}.
      Budget: ₹${budget}.
      Ethnicity: ${ethnicity}.
      Interests: ${interests.join(", ")}.
      Create a travel plan with day by day breakdown. Further breakdown each day into morning, afternoon and evening.
      Suggest popular places to visit, local cuisine to try, and cultural experiences.
      Ensure the plan is feasible within the budget and duration.
      Format the response in a clear, structured manner.
    `;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Step 2: Extract places (simple regex, adjust if needed)
    const lines = reply.split("\n").filter(l => l.toLowerCase().includes("visit"));
    const places = lines.map(l => {
      const match = l.match(/Visit\s+([A-Za-z\s]+?)(?:\.|,|$)/i);
      return match ? match[1].trim() : null;
    }).filter(Boolean);

    // Step 3: Call Routes API
    const coords = [];
    for (let place of places) {
      // Convert place name to coordinates using Geocoding API
      const geoRes = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: { address: place, key: process.env.GOOGLE_MAPS_API_KEY }
      });
      if (geoRes.data.results.length) {
        coords.push(geoRes.data.results[0].geometry.location);
      }
    }

    // Only if we have 2 or more places
    let transportInfo = [];
    if (coords.length >= 2) {
      for (let i = 0; i < coords.length - 1; i++) {
        const routeRes = await axios.post(
          `https://routes.googleapis.com/directions/v2:computeRoutes?key=${process.env.GOOGLE_MAPS_API_KEY}`,
          {
            origin: { location: { latLng: coords[i] } },
            destination: { location: { latLng: coords[i + 1] } },
            travelMode: "DRIVE"
          },
          { headers: { "Content-Type": "application/json", "X-Goog-FieldMask": "routes.distanceMeters,routes.duration" } }
        );

        const leg = routeRes.data.routes[0].legs[0];
        const distanceKm = (leg.distanceMeters / 1000).toFixed(1);
        const durationMin = Math.round(parseFloat(leg.duration) / 60);
        transportInfo.push(`🚗 From ${places[i]} to ${places[i + 1]}: ${distanceKm} km, approx ${durationMin} min`);
      }
    }

    // Step 4: Send response
    res.json({ itinerary: reply, places, transport: transportInfo, coords });

  } catch (err) {
    console.error("❌ Error generating plan:", err);
    res.status(500).json({ error: "Failed to generate travel plan" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
