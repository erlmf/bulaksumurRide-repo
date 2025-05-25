import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';      

export default function LeafletMap({
  centre = [-7.770, 110.378],
  zoom   = 15,
  enableSelect = false,
  onPickupSet,
  onDestinationSet,
  onDistanceSet,
  routeCoords = null
}) {
  const mapRef = useRef(null);     
  const routeLayerRef = useRef(null);

  useEffect(() => {
    const map = L.map('map').setView(centre, zoom);
    mapRef.current = map;

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(map);


    if (enableSelect) {
      let pick   = null;
      let dest   = null;
      let marker = null;

      map.on('click', (e) => {
        const { latlng } = e;
        if (!pick) {
          pick   = latlng;
          marker = L.marker(pick).addTo(map).bindPopup('Pickup').openPopup();
          onPickupSet?.(pick);
        } else if (!dest) {
          dest   = latlng;
          marker = L.marker(dest).addTo(map).bindPopup('Destination').openPopup();
          onDestinationSet?.(dest);
        }
      });
    }

    return () => map.remove();
  }, []);           

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;


    if (routeLayerRef.current) {
      map.removeControl(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routeCoords && routeCoords.length === 2) {
      const [start, end] = routeCoords;
      const routing = L.Routing.control({
        waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        lineOptions: { styles: [{ color: '#1e90ff', weight: 5 }] }
      })
        .on('routesfound', (e) => {
          const meters = e.routes[0].summary.totalDistance;
          console.log('routesfound - jarak: ', meters);
          onDistanceSet?.(meters);
        })
        .addTo(map);

      routeLayerRef.current = routing;
    }

  }, [routeCoords, onDistanceSet]);

  return <div id="map" style={{ height: 500, width: '100%' }} />;
}
