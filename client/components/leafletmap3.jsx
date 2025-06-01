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
  routeCoords = null,
  driverCoords = [[-7.770, 110.378]],
}) {
  const bulakCentre = [-7.770, 110.378]; // Bulaksumur Centre Coordinates
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

  const gojekIcon = L.icon({
    iconUrl: '/images/gojek.png',
    iconSize: [32,32],
    iconAnchor: [16,32],
    popupAnchor: [0,-32]
  })

  useEffect(() => {
    const map = L.map('map').setView(centre, zoom);
    mapRef.current = map;
    
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors' }
    ).addTo(map);
    
    L.circle(bulakCentre,{
      radius: 2000,
      color: 'blue',
      opacity: 0.2,
      fillColor: '#30f',
      fillOpacity: 0.1,
    }).addTo(map);
    
    //will adding the logic here to map all of the driver coordinate and display them on the map
    if(Array.isArray(driverCoords)){
      driverCoords.forEach(coords =>{
        L.marker(coords,{icon: gojekIcon}).addTo(map).bindPopup('Driver')
      })
    }else{
      L.marker(driverCoords, {icon: gojekIcon}).addTo(map);
    }
    // L.marker(driverCoords, { icon: gojekIcon }).addTo(map);

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

  }, [routeCoords, onDistanceSet]);

  return <div id="map" style={{ height: 500, width: '100%' }} />;
}
