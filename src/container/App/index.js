import * as React from "react";
import { Routes, Route } from "react-router-dom";

//pages
import HomePage from "../HomePage";
import DemoPage from "../DemoPage";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </div>
  );
}

export default App;
