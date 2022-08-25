import React from "react";
// import logo from './logo.svg';
import "./style/index.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Play from "./pages/Play";
import GalleryItem from "./pages/GalleryItem";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="gallery" >
          <Route path=":id" element={<GalleryItem />} />
        </Route>
       
      </Routes>
    </div>
  );
}

export default App;
