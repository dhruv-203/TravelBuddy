import React from "react";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";
import MapComponent from "./components/MapComponent";
import { useState, useRef } from "react";
import { OptionWindow } from "./components/Navbar";
import SearchFilter from "./components/SearchFilters";

function App() {
  const [markers, setMarkers] = useState([]);
  const map = useRef();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState("");
  const windowController = useRef();

  const background = useRef();
  const [buffer, setBuffer] = useState({
    country: "",
    query: "",
    radius: "",
    kinds: [],
  });
  const [kinds, setKinds] = useState([]);

  return (
    <>
      <div className="container" ref={background}>
        <Navbar
          markers={markers}
          map={map}
          setMarkers={setMarkers}
          background={background}
          windowController={windowController}
          buffer={buffer}
          setBuffer={setBuffer}
          query={query}
          setQuery={setQuery}
          country={country}
          setCountry={setCountry}
          radius={radius}
          setRadius={setRadius}
          kinds={kinds}
          setKinds={setKinds}
        />
        <MapComponent markers={markers} map={map} />
      </div>
      <OptionWindow
        children={
          <SearchFilter
            handleClick={(e) => {
              const val = e.target.innerHTML.toLocaleLowerCase();
              if (kinds.includes(val)) {
                setKinds([...kinds].filter((element) => element !== val));
                e.target.setAttribute(
                  "style",
                  "background-color:antiquewhite; color:black"
                );
              } else {
                setKinds([...kinds, val]);
                e.target.setAttribute(
                  "style",
                  "background-color:black;color:white"
                );
              }
            }}
            buffer={buffer}
            kinds={kinds}
            setKinds={setKinds}
            setBuffer={setBuffer}
            windowController={windowController}
            background={background}
            country={country}
            query={query}
            radius={radius}
            map={map}
            markers={markers}
            setMarkers={setMarkers}
          />
        }
        windowController={windowController}
        background={background}
      />
    </>
  );
}

export default App;
