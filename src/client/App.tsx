import React from "react";
// import logo from './logo.svg';
import "./style/index.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Play from "./pages/Play";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}

export default App;
