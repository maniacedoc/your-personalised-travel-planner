import React from "react";
import { useLocation } from "react-router-dom";

export default function ItineraryPage() {
  const location = useLocation();
  const { itinerary, duration } = location.state || {};

  if (!itinerary) {
    return <p>No itinerary found. Please submit your trip details first.</p>;
  }

  // Split itinerary into days safely
  const days = itinerary
    .split(/\n(?=Day \d+:)/)
    .filter(Boolean);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your {duration}-Day Itinerary</h1>
      {days.map((day, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-xl font-semibold">Day {index + 1}</h2>
          <pre className="whitespace-pre-wrap">{day.trim()}</pre>
        </div>
      ))}
    </div>
  );
}
