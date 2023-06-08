import { useState, useCallback } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import showToast from "./sleep";
import img from "./gps.png";
import { placeLocator, placesWithKinds, placesWithoutKinds } from "./config";
function SearchFilter({ handleClick }) {
  return (
    <div className="searchFilters">
      <div className="top-tier">
        <div onClick={handleClick} className="accomodations item">
          Accomodations
        </div>
        <div onClick={handleClick} className="amusements item">
          Amusements
        </div>
        <div onClick={handleClick} className="sport item">
          Sport
        </div>
      </div>
      <div className="interesting_places">
        <h2
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "4",
            justifySelf: "center",
          }}
        >
          Interesting Places
        </h2>
        <div onClick={handleClick} className="architecture item">
          Architecture
        </div>
        <div onClick={handleClick} className="cultural item">
          Cultural
        </div>
        <div onClick={handleClick} className="historic item">
          Historic
        </div>
        <div onClick={handleClick} className="natural item">
          Natural
        </div>
        <div onClick={handleClick} className="religion item">
          Religion
        </div>
        <div onClick={handleClick} className="other item">
          Other
        </div>
      </div>
      <div className="tourist_facility">
        <h2
          style={{
            gridColumnStart: "1",
            gridColumnEnd: "3",
            justifySelf: "center",
          }}
        >
          Tourist Facility
        </h2>
        <div onClick={handleClick} className="banks item">
          Banks
        </div>
        <div onClick={handleClick} className="foods item">
          Foods
        </div>
        <div onClick={handleClick} className="shops item">
          Shops
        </div>
        <div onClick={handleClick} className="transport item">
          Transport
        </div>
      </div>
    </div>
  );
}

export default function ControllerComp({ markers, map, setMarkers }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState(50);
  const [kinds, setKinds] = useState([]);

  const fetchLocation = useCallback(async () => {
    const response = await fetch(
      `https://restcountries.com/v2/name/${encodeURIComponent(
        country
      )}?fullText=true`
    );
    var Tmp = await response.json();
    if (Object.keys(Tmp).includes("status")) {
      showToast("Enter Valid Country Name", "medium");
      setMarkers([]);
      return null;
    }
    const res = await fetch(placeLocator(query, Tmp[0].alpha2Code));
    const result = await res.json();
    if (result["status"] === "NOT_FOUND") {
      showToast(result.error, "medium");
      setMarkers([]);
      return null;
    }
    map.current.panTo([result.lat, result.lon]);
    map.current.setZoom("10");
    const new_res =
      kinds.length > 0
        ? fetch(placesWithKinds(query, radius, result.lon, result.lat, kinds))
        : await fetch(
            placesWithoutKinds(query, radius, result.lon, result.lat)
          );
    const new_result = await new_res.json();
    let tmp = [];
    if (new_result && new_result.features && new_result.features.length > 0) {
      new_result.features.forEach((val, idx) => {
        if (idx === new_result.features.length - 1) {
          // taken the co-ordinates of the last element
          map.current.panTo([
            val.geometry.coordinates[1],
            val.geometry.coordinates[0],
          ]);
          map.current.setZoom("10");
        }
        tmp.push(
          // pushing marker for each obtained location
          <Marker
            key={idx}
            position={[
              val.geometry.coordinates[1],
              val.geometry.coordinates[0],
            ]}
            icon={L.icon({
              iconUrl: img,
              iconSize: [32, 32],
            })}
          >
            <Popup key={idx}>
              <div
                dangerouslySetInnerHTML={{
                  __html: val.properties.highlighted_name,
                }}
              />
            </Popup>
          </Marker>
        );
      });
      setMarkers(tmp);
    } else {
      setMarkers([]);
      showToast("No Results Found", "medium");
    }
  }, [query, country, kinds, radius]);

  return (
    <div className="Controller">
      <div className="inputCont">
        <label>Enter Place Name</label>
        <input
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          value={query}
        />
      </div>
      <div className="inputCont">
        <label>Enter Country Name</label>
        <input
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          value={country}
        />
      </div>
      <div className="inputCont">
        <label>Enter the search radius</label>
        <input
          onChange={(e) => {
            setRadius(e.target.value);
          }}
          value={radius}
          title="Enter the radius in KMs"
        />
      </div>
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
      />
      <button
        style={{
          justifySelf: "center",
          alignSelf: "center",
          width: "100px",
        }}
        onClick={() => {
          if (query !== "" && country !== "" && radius !== "") {
            if (!isNaN(Number(radius))) {
              fetchLocation();
            } else {
              showToast("Enter Valid Radius, Integer Value expected", "medium");
              setMarkers([]);
            }
          } else {
            if (query === "") {
              showToast("Please Enter Place Name", "medium");
              setMarkers([]);
            } else if (country === "") {
              showToast("Please Enter Country Name", "medium");
              setMarkers([]);
            } else if (radius === "") {
              showToast("Please the Search Radius", "medium");
              setMarkers([]);
            }
          }
        }}
      >
        Search
      </button>
    </div>
  );
}
