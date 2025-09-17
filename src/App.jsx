import React from "react";
import { Routes, Route } from "react-router-dom";
import FormPage from "./FormPage";
import Itinerary from "./Itinerary";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/itinerary" element={<Itinerary />} />
    </Routes>
  );
}
