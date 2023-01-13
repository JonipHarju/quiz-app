import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./components/game";
import FrontPage from "./FrontPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/quiz-app" element={<FrontPage />} />
        <Route path="/quiz-app/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}
