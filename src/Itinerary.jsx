import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary, duration } = location.state || {};

  console.log("Itinerary page received itinerary:", itinerary);
  console.log("Itinerary page received duration:", duration);

  if (!itinerary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="mb-4">⚠️ No itinerary found. Please submit the form first.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  // If itinerary is a string, display as is
  // If itinerary is an object with days array, display day-wise
  if (typeof itinerary === "string") {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          Your {duration}-Day Itinerary
        </h1>

        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-blue-300">
          <pre className="text-gray-700 whitespace-pre-wrap font-sans">
            {itinerary}
          </pre>
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
  } else if (typeof itinerary === "object" && Array.isArray(itinerary.days)) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
          Your {duration}-Day Itinerary
        </h1>

        <div className="space-y-6 max-w-4xl mx-auto">
          {itinerary.days.map((day, index) => (
            <div key={day.day || index} className="bg-white shadow-md rounded-lg p-6 border border-blue-300">
              <h2 className="text-2xl font-semibold text-blue-800 mb-3">
                Day {day.day || index + 1}: {day.title || "Activities"}
              </h2>
              {Array.isArray(day.activities) ? (
                <ul className="list-disc list-inside text-gray-700">
                  {day.activities.map((act, i) => <li key={i}>{act}</li>)}
                </ul>
              ) : (
                <p className="text-gray-700">No activities listed for this day.</p>
              )}
              {day.approx_cost && <p className="mt-2 text-gray-600">Approx Cost: {day.approx_cost}</p>}
              {day.notes && <p className="mt-1 text-gray-600 italic">{day.notes}</p>}
            </div>
          ))}
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
  } else {
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
}
