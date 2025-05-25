import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('../components/leafletmap3'), { ssr: false });

export default function OrderPage() {
  const [pickup, setPickup]     = useState(null);
  const [destination, setDest]  = useState(null);
  const [distance, setDistance] = useState(null);   

  const routeCoords = useMemo(() => (
    pickup && destination
      ? [[pickup.lat, pickup.lng], [destination.lat, destination.lng]]
      : null
  ), [pickup, destination]);

  const fare = useMemo(() => {
    if (!distance) return null;
    const baseFare = 5000; // base fare in IDR
    const perKmRate = 3000; // rate per km in IDR
    return baseFare + (distance / 1000) * perKmRate;
  }, [distance]);

  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', maximumFractionDigits:0}).format(n);

  return (
    <>
      <LeafletMap
        centre={[-7.770, 110.378]}
        zoom={15}
        enableSelect
        onPickupSet={setPickup}
        onDestinationSet={setDest}
        routeCoords={routeCoords}
        onDistanceSet={setDistance} 
      />

      <div style={{ background: '#000', color: '#fff', padding: 8 }}>
        <p>Pickup: {pickup ? `${pickup.lat}, ${pickup.lng}` : 'Not set'}</p>
        <p>Destination: {destination ? `${destination.lat}, ${destination.lng}` : 'Not set'}</p>
        {distance && <p>Distance: {(distance / 1000).toFixed(2)} km</p>}
        {fare && <p>Fare: {rupiah(fare)}</p>}
      </div>
    </>
  );
}
