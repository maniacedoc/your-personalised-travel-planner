import React from "react";
import { Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import ItineraryWithMap from "./ItineraryWithMap";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route
        path="/itinerary"
        element={
          <ErrorBoundary>
            <ItineraryWithMap />
          </ErrorBoundary>
        }
      />
    </Routes>
  );
}
