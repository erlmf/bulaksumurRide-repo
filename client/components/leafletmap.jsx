import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap() {
  useEffect(() => {
    // Initialize the map
    const map = L.map("map").setView([-7.77, 110.38], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a marker
    //L.marker([-7.77, 110.38]).addTo(map).bindPopup("Bulaksumur");

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  return <div id="map" style={{ height: "500px" }}></div>;
}