import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import showToast from "./sleep";
import img from "../gps.png";
import { apikey } from "../config";
import close from "../close.png";
import "../styles/Navbar.css";
import searchIcon from "../search.png";

export function OptionWindow({ children, windowController, background }) {
  return (
    <div className="optionWindow" ref={windowController}>
      <img
        className="closeButton"
        onClick={() => {
          windowController.current.style.display = "none";
          background.current.style.filter = "none";
          background.current.style.webkitFilter = "none";
        }}
        src={close}
        alt="close"
      />
      {children}
    </div>
  );
}

export default function Navbar({
  markers,
  map,
  setMarkers,
  background,
  windowController,
  buffer,
  setBuffer,
}) {
  const [Children, setChildren] = useState(false);

  const OptionContainer = useMemo(() => {
    function DefaultOptions() {
      return (
        <div className="defaultOptions">
          <span
            onClick={() => {
              setChildren(true);
            }}
          >
            Search
          </span>
          <span
            onClick={(e) => {
              // console.log();
              windowController.current.style.display = "block";
              background.current.style.filter = "blur(5px)";
              background.current.style.webkitFilter = "blur(5px)";
            }}
          >
            Filters
          </span>
          <span>About</span>
        </div>
      );
    }
    function SearchOptions() {
      const [query, setQuery] = useState(buffer.query);
      const [country, setCountry] = useState(buffer.country);
      const [radius, setRadius] = useState(buffer.radius);

      const fetchLocation = useCallback(async () => {
        // Validation
        if (query === "") {
          showToast("Please Enter Place Name", "medium");
          setMarkers([]);
          return;
        } else if (country === "") {
          showToast("Please Enter Country Name", "medium");
          setMarkers([]);
          return;
        } else if (radius === "") {
          showToast("Please the Search Radius", "medium");
          setMarkers([]);
          return;
        } else if (isNaN(Number(radius))) {
          showToast("Enter Valid Radius, Integer Value expected", "medium");
          setMarkers([]);
          return;
        }

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
        const res = await fetch(
          `https://api.opentripmap.com/0.1/en/places/geoname?name=${encodeURIComponent(
            query
          )}&country=${Tmp[0].alpha2Code}&apikey=${apikey()}`
        );
        const result = await res.json();
        if (result["status"] === "NOT_FOUND") {
          showToast(result.error, "medium");
          setMarkers([]);
          return null;
        }
        map.current.panTo([result.lat, result.lon]);
        map.current.setZoom("10");
        const new_res =
          buffer.kinds.length > 0
            ? fetch(
                `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${encodeURIComponent(
                  query
                )}&radius=${radius * 1000}&lon=${result.lon}&lat=${
                  result.lat
                }&kinds=${buffer.kinds.toLocaleString()}&apikey=${apikey()}&limit=1000`
              )
            : await fetch(
                `https://api.opentripmap.com/0.1/en/places/autosuggest?name=${encodeURIComponent(
                  query
                )}&radius=${radius * 1000}&lon=${result.lon}&lat=${
                  result.lat
                }&apikey=${apikey()}&limit=1000`
              );
        const new_result = await new_res.json();
        let tmp = [];
        if (
          new_result &&
          new_result.features &&
          new_result.features.length > 0
        ) {
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
      }, [query, country, buffer.kinds, radius]);
      return (
        <div className="SearchOption">
          <div className="inputCont">
            <input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              placeholder="Enter Place Name"
            />
          </div>
          <div className="inputCont">
            <input
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              value={country}
              placeholder="Enter Country Name"
            />
          </div>
          <div className="inputCont">
            <input
              onChange={(e) => {
                setRadius(e.target.value);
              }}
              value={radius}
              title="Enter the radius in KMs"
              placeholder="Enter the search radius"
            />
          </div>
          <span
            style={{
              justifySelf: "center",
              alignSelf: "center",
            }}
            onClick={(e) => {
              fetchLocation(
                country,
                query,
                radius,
                buffer.kinds,
                map,
                markers,
                setMarkers
              );
            }}
          >
            <img srcSet={searchIcon} alt="search" />
          </span>
          <img
            srcSet={close}
            alt="close"
            onClick={() => {
              setBuffer({
                ...buffer,
                country: country,
                query: query,
                radius: radius,
              });
              setChildren(false);
            }}
          />
        </div>
      );
    }
    return (
      <div className="NavChildren">
        {Children ? <SearchOptions /> : <DefaultOptions />}
      </div>
    );
  }, [Children]);
  return (
    <div className="Navbar">
      <div className="navHead">Travel Buddy</div>
      {OptionContainer}
    </div>
  );
}
