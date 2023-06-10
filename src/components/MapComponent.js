import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import img from "../person.png";

export default function MapComponent({ markers, map }) {
  const [position, setPosition] = useState([0, 0]);
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (cPosition) {
        setPosition([cPosition.coords.latitude, cPosition.coords.longitude]);
      });
    }
  }, []);
  useEffect(() => {
    if (position.length > 0 && map.current !== null) {
      map.current.panTo(position);
    }
  }, [position]);
  return (
    <MapContainer center={position} zoom={15} ref={map}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; OpenStreetMap contributors"
      />
      <Marker
        position={position}
        icon={L.icon({
          iconUrl: img,
          iconSize: [32, 32],
        })}
      ></Marker>
      {markers}
    </MapContainer>
  );
}
