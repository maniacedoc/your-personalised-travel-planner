import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";

export default function FormPage() {
  const [form, setForm] = useState({
    name: "",
    ethnicity: "",
    budget: "",
    interests: [],
    duration: "",
    state: "",
  });

  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleChange(e) {
    const { name, value, multiple, options } = e.target;
    if (multiple) {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setForm((prev) => ({ ...prev, [name]: selected }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitting:", form); // ✅ should log

    function parseItinerary(text) {
      // Split by "Day X" headings
      const dayRegex = /Day\s+(\d+)/g;
      const days = [];
      let lastIndex = 0;
      let match;

      while ((match = dayRegex.exec(text)) !== null) {
        if (match.index !== 0) {
          const dayText = text.substring(lastIndex, match.index).trim();
          if (days.length > 0) {
            days[days.length - 1].activities = dayText
              .split(/\\n|\\r\\n/)
              .map((line) => line.trim())
              .filter((line) => line.length > 0);
          }
        }
        days.push({ day: parseInt(match[1]), activities: [] });
        lastIndex = dayRegex.lastIndex;
      }
      // Add last day activities
      const lastDayText = text.substring(lastIndex).trim();
      if (days.length > 0) {
        days[days.length - 1].activities = lastDayText
          .split(/\\n|\\r\\n/)
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      }

      return { days };
    }

    try {
      const response = await fetch("http://localhost:4000/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      setLoading(false);

      if (data.itinerary) {
        const parsedItinerary = parseItinerary(data.itinerary);
        navigate("/itinerary", {
          state: { itinerary: parsedItinerary, duration: form.duration },
        });
      } else {
        alert("Failed to get itinerary from backend.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Fetch error:", err);
      alert("Error fetching itinerary. Check backend is running.");
    }
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: `url(${images[currentImage]})`,
        backgroundSize: "cover", // Ensures the image covers the entire viewport
        backgroundRepeat: "no-repeat", // Prevents tiling
        backgroundPosition: "center", // Centers the image  
        height: "100vh", // Ensures it takes full viewport height
        width: "100vw", // Ensures it takes full viewport width
      }}
    >
      <div className="absolute inset-0 bg-blue-900/40"></div>

      <div className="relative z-10 flex-1 flex items-center justify-center w-full px-10">
        <div className="bg-blue-900/90 text-white rounded-xl shadow-2xl p-8 w-full max-w-md border-2 border-white">
          <h1 className="text-3xl font-extrabold text-center mb-20" style={{textAlign: 'center'}}>
            TRAVEL PLANNER
          </h1>

          <form onSubmit={handleSubmit} className="form-container">
            <div className="formpart">
             <label className="formquestions">Name: </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black"
              required
              disabled={loading}
            />
            </div>

            <div className="formpart">
              <label className="formquestions">Ethnicity: </label>
            <input
              type="text"
              name="ethnicity"
              value={form.ethnicity}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black"
              required
              disabled={loading}
            />
            </div>

            <div className="formpart">
              <label className="formquestions">Budget (₹): </label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black"
              required
              disabled={loading}
            />
            </div>

            <div className="formpart">
              <label className="formquestions">Interests: </label>
              <select
                name="interests"
                multiple
                value={form.interests}
                onChange={handleChange}
                className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black h-32"
                required
                disabled={loading}
              >
                <option value="nightlife">Nightlife</option>
                <option value="wildlife">Wildlife Safari</option>
                <option value="religious">Religious Places</option>
                <option value="adventure">Adventure Sports</option>
                <option value="heritage">Heritage & Culture</option>
                <option value="beaches">Beaches</option>
              </select>
                <p style={{ color: 'gray', fontSize: 'smaller' }}>(Hold Ctrl and Click to add multiple options)</p>
            </div>

            <div className="formpart">
              <label className="formquestions">Duration (days): </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black"
              required
              disabled={loading}
            />
            </div>

            <div className="formpart">
              <label className="formquestions">State to Visit</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              className="mt-1 w-full border-2 border-blue-500 rounded-md p-2 font-semibold text-black"
              required
              disabled={loading}
            />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md mt-4 hover:bg-green-700 font-bold shadow-md"
             
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <footer className="relative z-10 bg-blue-950/90 text-white py-4 w-full text-center mt-6">
        <p>📧 Contact us: support@travelplanner.com</p>
      </footer>
    </div>
  );
}
