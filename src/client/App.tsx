import React from "react";
// import logo from './logo.svg';
// import "./style/index.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
