import axios from "axios";

const API_KEY = "AIzaSyDMV6-qLzAHeEWX_tn4plxzD31YEZnX218"; // your key

async function testRoute() {
  console.log("▶ Starting Routes API test...");

  try {
    const response = await axios.post(
      `https://routes.googleapis.com/directions/v2:computeRoutes?key=${API_KEY}`,
      {
        origin: {
          location: { latLng: { latitude: 15.5553, longitude: 73.7517 } } // Calangute
        },
        destination: {
          location: { latLng: { latitude: 15.492, longitude: 73.8278 } } // Panjim
        },
        travelMode: "DRIVE"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
        }
      }
    );

    console.log("✅ Routes API response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ Error occurred:");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.log("Message:", error.message);
    }
  } finally {
    console.log("▶ Test finished.");
  }
}

testRoute();
