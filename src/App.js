import React from "react";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";
import MapComponent from "./components/MapComponent";
import { useState, useRef } from "react";
function App() {
  const [markers, setMarkers] = useState([]);
  const map = useRef();
  console.log(window.screen.width);
  return (
    <div className="container">
      <Navbar markers={markers} map={map} setMarkers={setMarkers} />
      {/* <ControllerComp markers={markers} map={map} setMarkers={setMarkers} /> */}
      <MapComponent markers={markers} map={map} />
    </div>
  );
}

export default App;
