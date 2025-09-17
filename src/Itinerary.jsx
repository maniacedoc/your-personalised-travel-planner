import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Itinerary() {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state;

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>No trip details found. Please go back and submit the form.</p>
        <button
          onClick={() => navigate("/")}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  }

  const days = parseInt(form.duration);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">
        Your {days}-Day Itinerary for {form.state}
      </h1>

      <div className="space-y-6">
        {Array.from({ length: days }).map((_, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-6 border border-blue-300"
          >
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">
              Day {i + 1}
            </h2>
            <p className="text-gray-700">
              Activities for this day will be suggested here based on your
              interests: {form.interests.join(", ")}.
            </p>
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
}
