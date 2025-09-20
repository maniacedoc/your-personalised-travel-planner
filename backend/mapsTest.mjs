import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

async function testGoogleMaps() {
  const origin = "Bangalore Palace, Bangalore";
  const destination = "Lalbagh Botanical Garden, Bangalore";

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(
    destination
  )}&mode=transit&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testGoogleMaps();
