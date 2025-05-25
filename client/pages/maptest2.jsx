import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
const LeafletMap = dynamic(() => import('../components/leafletmap3'), { ssr:false });

export default function OrderPage() {
  const [pickup, setPickup]       = useState(null);
  const [destination, setDest]    = useState(null);
  //const [distance, setDistance] = useState(null);

  const route = useMemo(() => {
    return pickup && destination
      ? [
          [pickup.lat, pickup.lng],
          [destination.lat, destination.lng]
        ]
      : null;
  }, [pickup, destination]);

  return (
    <>
      <LeafletMap
        centre={[-7.770, 110.378]}
        zoom={15}
        enableSelect       
        onPickupSet={setPickup}
        onDestinationSet={setDest}
        routeCoords={route}
        //onDistance={setDistance} 
      />

      <div style={{background:'#000',color:'#fff',padding:8}}>
        <p>Pickup: {pickup ? `${pickup.lat}, ${pickup.lng}` : 'Not set'}</p>
        <p>Destination: {destination ? `${destination.lat}, ${destination.lng}` : 'Not set'}</p>
      </div>
    </>
  );
}
