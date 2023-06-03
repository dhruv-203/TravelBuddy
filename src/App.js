import React from "react";
import "leaflet/dist/leaflet.css";
import ControllerComp from "./ControllerComp";
import MapComponent from "./MapComponent";
import { useState, useRef } from "react";
function App() {
  const [markers, setMarkers] = useState([]);
  const map = useRef();

  return (
    <div className="container">
      <ControllerComp markers={markers} map={map} setMarkers={setMarkers} />
      <MapComponent markers={markers} map={map} />
    </div>
  );
}

export default App;
