import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";


// Sample location data for demonstration
const sampleLocations = [
  { lat: 12.9716, lng: 77.5946, name: "Bangalore Palace", description: "Historic palace in Bangalore" },
  { lat: 12.9757, lng: 77.6208, name: "Lalbagh Botanical Garden", description: "Beautiful botanical garden" },
  { lat: 12.9352, lng: 77.6245, name: "Bangalore Fort", description: "Historic fort and museum" }
];

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, duration } = location.state || {};

  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="mb-4">
          ⚠️ No itinerary found. Please submit the form first.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  // Case 1: itinerary is a string (Gemini-style markdown response)
  if (typeof itinerary === "string") {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          Your {duration}-Day Itinerary
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Itinerary Details */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-blue-300">
            <pre className="whitespace-pre-wrap text-gray-700">{itinerary}</pre>
          </div>

          {/* Map Section */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-blue-300">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Trip Map</h3>
            <Map locations={sampleLocations} height="400px" />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    );
  }

  // Case 2: itinerary is an object with days[]
  if (typeof itinerary === "object" && Array.isArray(itinerary.days)) {
    const day = itinerary.days[currentDayIndex];

    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          Your {duration}-Day Itinerary
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Itinerary Details */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-blue-300">
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">
              Day {day.day || currentDayIndex + 1}: {day.title || "Activities"}
            </h2>

            {Array.isArray(day.activities) ? (
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {day.activities.map((act, i) => (
                  <li key={i} className="mb-2">
                    {act}
                    {day.transport && day.transport[i] && (
                      <p className="text-sm text-gray-500">
                        🚗 Transport: {day.transport[i].mode} — {day.transport[i].duration}, approx {day.transport[i].cost}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700 mb-4">
                No activities listed for this day.
              </p>
            )}

            {day.approx_cost && (
              <p className="mt-2 text-gray-600">Approx Cost: {day.approx_cost}</p>
            )}
            {day.notes && (
              <p className="mt-1 text-gray-600 italic">{day.notes}</p>
            )}
          </div>

          {/* Map Section */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-blue-300">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Trip Map</h3>
            <Map locations={sampleLocations} height="400px" />
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between w-full max-w-6xl">
          <button
            onClick={() => setCurrentDayIndex((idx) => Math.max(idx - 1, 0))}
            disabled={currentDayIndex === 0}
            className={`px-4 py-2 rounded-md font-bold ${
              currentDayIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            &larr; Previous
          </button>

          <button
            onClick={() =>
              setCurrentDayIndex((idx) =>
                Math.min(idx + 1, itinerary.days.length - 1)
              )
            }
            disabled={currentDayIndex === itinerary.days.length - 1}
            className={`px-4 py-2 rounded-md font-bold ${
              currentDayIndex === itinerary.days.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next &rarr;
          </button>
        </div>

        <div className="mt-8 flex justify-center w-full max-w-6xl">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold"
          >
            Plan Another Trip
          </button>
        </div>
      </div>
    );
  }

  // Case 3: fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="mb-4">⚠️ Itinerary format not recognized.</p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Back
      </button>
    </div>
  );
}
