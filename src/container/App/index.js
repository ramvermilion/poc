import * as React from "react";
import { Routes, Route } from "react-router-dom";

//pages
import HomePage from "../HomePage";
import DemoPage from "../DemoPage";
import ResizableTable from "../Resizable";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/resize" element={<ResizableTable />} />
      </Routes>
    </div>
  );
}

export default App;
