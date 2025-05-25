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

  const pickupIcon = L.icon({
      iconUrl: '/images/pickup.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
  });

  const dropoffIcon = L.icon({
      iconUrl: '/images/destination.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
  });

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
          marker = L.marker(pick, { icon: pickupIcon}).addTo(map).bindPopup('Pickup').openPopup();
          onPickupSet?.(pick);
        } else if (!dest) {
          dest   = latlng;
          marker = L.marker(dest, { icon: dropoffIcon}).addTo(map).bindPopup('Destination').openPopup();
          onDestinationSet?.(dest);
        }
      });
    }

    return () => {
      // Clean up routing control before removing map
      if (routeLayerRef.current && map.hasLayer && map.hasLayer(routeLayerRef.current)) {
        try {
          map.removeControl(routeLayerRef.current);
        } catch (error) {
          console.warn('Error removing route control:', error);
        }
        routeLayerRef.current = null;
      }
      map.remove();
    };
  }, []);           

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up existing route
    if (routeLayerRef.current && map.hasLayer(routeLayerRef.current._container)) {
      try {
        map.removeControl(routeLayerRef.current);
      } catch (err) {
        console.warn("Warning removing control:", err.message);
      }
      routeLayerRef.current = null;
    }


    if (routeCoords && routeCoords.length === 2) {
      const [start, end] = routeCoords;
      
      // Validate coordinates
      if (start && start.length === 2 && end && end.length === 2 && 
          !isNaN(start[0]) && !isNaN(start[1]) && !isNaN(end[0]) && !isNaN(end[1])) {
        
        const routing = L.Routing.control({
          waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
          show: false,
          addWaypoints: false,
          draggableWaypoints: false,
          lineOptions: { styles: [{ color: '#1e90ff', weight: 5 }] },
          createMarker: function (i, waypoint, n) {
            return L.marker(waypoint.latLng, {
              icon: i === 0 ? pickupIcon : dropoffIcon
            }).bindPopup(i === 0 ? 'Pickup' : 'Destination');
          }
        })
          .on('routesfound', (e) => {
            const meters = e.routes[0].summary.totalDistance;
            console.log('routesfound - jarak: ', meters);
            onDistanceSet?.(meters);
          })
          .addTo(map);

        routeLayerRef.current = routing;
      }
    }

  }, [routeCoords, onDistanceSet]);

  return <div id="map" style={{ height: 500, width: '100%' }} />;
}