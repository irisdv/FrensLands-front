import React from "react";
// import logo from './logo.svg';
import "./style/index.css";
import "./style/home.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Team from "./pages/Team";
import Tutorial from "./pages/Tutorial";
import Docs from "./pages/Docs";
import Roadmap from "./pages/Roadmap";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/about" element={<Team />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </div>
  );
}

export default App;
