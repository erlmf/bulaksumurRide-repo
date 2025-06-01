import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LeafletMap({
  centre = [-7.770, 110.378],
  zoom = 15,
  enableSelect = false,
  onPickupSet,
  onDestinationSet,
  onDistanceSet,
  routeCoords = null,
  driverCoords = [[-7.770, 110.378]],
  onStreetNameFound
}) {
  const bulakCentre = [-7.770, 110.378]; // Bulaksumur Centre Coordinates
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

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
    iconUrl: '/images/skuter.jpg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })

  // Helper function to extract meaningful street names
  const extractStreetNames = (route) => {
    try {
      const instructions = route.instructions || [];
      
      console.log('All route instructions:', instructions);
      
      // Filter out instructions that have meaningful street names
      const meaningfulInstructions = instructions.filter(instruction => {
        const name = instruction.name || instruction.road || instruction.street;
        return name && 
               name.trim() !== '' && 
               !name.includes('Destination') &&
               !name.includes('Origin') &&
               name !== 'Unnamed Road';
      });
      
      console.log('Meaningful instructions:', meaningfulInstructions);
      
      let pickupStreet = 'Unknown Street';  
      let dropOffStreet = 'Unknown Street';
      
      if (meaningfulInstructions.length > 0) {
        // Get the first meaningful street name (pickup area)
        const firstInstruction = meaningfulInstructions[0];
        pickupStreet = firstInstruction.name || firstInstruction.road || firstInstruction.street || 'Unknown Street';
        
        // Get the last meaningful street name (destination area)
        const lastInstruction = meaningfulInstructions[meaningfulInstructions.length - 1];
        dropOffStreet = lastInstruction.name || lastInstruction.road || lastInstruction.street || 'Unknown Street';
      }
      
      return { pickupStreet, dropOffStreet };
    } catch (error) {
      console.error('Error extracting street names:', error);
      return { pickupStreet: 'Unknown Street', dropOffStreet: 'Unknown Street' };
    }
  };

  // Alternative method using reverse geocoding
 

  useEffect(() => {
    try {
      const map = L.map('map').setView(centre, zoom);
      mapRef.current = map;

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '&copy; OpenStreetMap contributors' }
      ).addTo(map)
      .on('tileerror', (err) => {
        console.error('Tile loading error:', err);
        setError('Failed to load map tiles. Check your internet connection.');
      });

      L.circle(bulakCentre, {
        radius: 2000,
        color: 'blue',
        opacity: 0.2,
        fillColor: '#30f',
        fillOpacity: 0.1,
      }).addTo(map);

      // Add driver markers with error handling
      try {
        if (Array.isArray(driverCoords)) {
          driverCoords.forEach(coords => {
            if (coords && coords.length === 2) {
              const marker = L.marker(coords, { icon: gojekIcon }).addTo(map).bindPopup('Driver');
              markersRef.current.push(marker);
            }
          });
        } else if (driverCoords) {
          const marker = L.marker(driverCoords, { icon: gojekIcon }).addTo(map);
          markersRef.current.push(marker);
        }
      } catch (markerError) {
        console.error('Error adding driver markers:', markerError);
      }

      if (enableSelect) {
        let pick = null;
        let dest = null;
        let marker = null;

        map.on('click', (e) => {
          try {
            const { latlng } = e;

            if (!pick) {
              pick = latlng;
              marker = L.marker(pick, { icon: pickupIcon }).addTo(map).bindPopup('Pickup').openPopup();
              markersRef.current.push(marker);
              onPickupSet?.(pick);
            } else if (!dest) {
              dest = latlng;
              marker = L.marker(dest, { icon: dropoffIcon }).addTo(map).bindPopup('Destination').openPopup();
              markersRef.current.push(marker);
              onDestinationSet?.(dest);
            }
          } catch (err) {
            console.error('Error handling map click:', err);
            setError('Failed to process map selection.');
          }
        });
      }

      return () => {
        try {
          // Clean up all markers
          if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
              if (map && marker) {
                try {
                  map.removeLayer(marker);
                } catch (err) {
                  console.error('Error removing marker:', err);
                }
              }
            });
            markersRef.current = [];
          }
          
          // Clean up routing control
          if (routeLayerRef.current && map) {
            try {
              map.removeControl(routeLayerRef.current);
              routeLayerRef.current = null;
            } catch (err) {
              console.error('Error removing route control:', err);
            }
          }
          
          map.remove();
        } catch (err) {
          console.error('Error during map cleanup:', err);
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map. Please refresh the page.');
      return () => {};
    }
  }, []);

  useEffect(() => {
    try {
      const map = mapRef.current;
      if (!map) return;

      if (routeLayerRef.current) {
        try {
          map.removeControl(routeLayerRef.current);
          routeLayerRef.current = null;
        } catch (err) {
          console.error('Error removing existing route control:', err);
        }
      }

      if (routeCoords && routeCoords.length === 2) {
        try {
          const [start, end] = routeCoords;
          
          // Validate coordinates
          if (!start || !end || start.length !== 2 || end.length !== 2 ||
              start.some(isNaN) || end.some(isNaN)) {
            console.error('Invalid route coordinates', routeCoords);
            return;
          }
          
          const routing = L.Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
            show: false,
            addWaypoints: false,
            draggableWaypoints: false,
            lineOptions: { styles: [{ color: '#1e90ff', weight: 5 }] },
            createMarker: function (i, waypoint, n) {
              try {
                const marker = L.marker(waypoint.latLng, {
                  icon: i === 0 ? pickupIcon : dropoffIcon
                }).bindPopup(i === 0 ? 'Pickup' : 'Destination');
                markersRef.current.push(marker);
                return marker;
              } catch (err) {
                console.error('Error creating route marker:', err);
                return null; // Skip this marker on error
              }
            }
          })
          .on('routesfound', async (e) => {
            try {
              const route = e.routes[0];
              const meters = route.summary.totalDistance;
              console.log('routesfound - jarak: ', meters);
              onDistanceSet?.(meters);
              
              // Method 1: Try to extract from route instructions
              const streetNames = extractStreetNames(route);
              
              console.log('Final street names:', streetNames);
              
              // Update the callback parameters to match what RideForm2.jsx expects
              if (onStreetNameFound) {
                onStreetNameFound({
                  pickup: streetNames.pickupStreet,
                  dropoff: streetNames.dropOffStreet
                });
              }
            } catch (err) {
              console.error('Error processing route data:', err);
            }
          })
          .on('routingerror', (err) => {
            console.error('Routing error:', err);
            setError('Could not calculate the route between locations.');
          });
          
          routing.addTo(map);
          routeLayerRef.current = routing;
        } catch (err) {
          console.error('Error setting up route:', err);
          setError('Error displaying the route on the map.');
        }
      }
    } catch (err) {
      console.error('Error in route update effect:', err);
    }
  }, [routeCoords, onDistanceSet]);

  return (
    <>
      <div id="map" style={{ height: 500, width: '100%' }} />
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
}