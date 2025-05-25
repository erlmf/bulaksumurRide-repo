import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const haversine = (coord1, coord2) => {
  const R = 6371;
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) *
    Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export function EstimationForm() {
  const router = useRouter();
  const { pickup: pickupQuery, dropoff: dropoffQuery } = router.query;

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);

  useEffect(() => {
    if (pickupQuery && dropoffQuery) {
      setPickup(pickupQuery);
      setDropoff(dropoffQuery);

      const [pLat, pLng] = pickupQuery.split(",").map(Number);
      const [dLat, dLng] = dropoffQuery.split(",").map(Number);

      const dist = haversine({ lat: pLat, lng: pLng }, { lat: dLat, lng: dLng });
      setDistance(dist.toFixed(2));
      setFare(Math.ceil(dist * 3000));
    }
  }, [pickupQuery, dropoffQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      pickup,
      dropoff,
      distance,
      fare,
      paymentMethod,
    };
    console.log("Booking Data:", bookingData);
    router.push("/searching");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm px-5 py-3 flex justify-between items-center">
        <h1 className="text-lg font-bold">BulaksumurRide</h1>
        <button className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition-colors">
          Login
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-grow w-full flex flex-col items-center">
        <div className="w-full max-w-screen-xl px-6 py-6 flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-3xl">🛵</span>
              Bulak <span className="text-blue-600">Ride</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
            {/* Fare Summary */}
            <Card className="bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Total fare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ride fare</span>
                  <span className="font-semibold">Rp {fare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 italic">Discount</span>
                  <span className="text-gray-500 italic">Rp 0</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {fare.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Map View Placeholder */}
            <div className="bg-black rounded-lg h-full w-full relative overflow-hidden min-h-[180px]">
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <span className="text-white text-sm opacity-50">Map View</span>
              </div>
            </div>

            {/* Payment Method */}
            <Card className="bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payment method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Cash', 'BulakPay', 'QRIS'].map(method => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">{method}</span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Pickup / Dropoff Form */}
            <form onSubmit={handleSubmit} className="space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="py-3 bg-white border border-gray-300 rounded-lg"
                  required
                />
                <Input
                  type="text"
                  placeholder="Dropoff location"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="py-3 bg-white border border-gray-300 rounded-lg"
                  required
                />
                <p className="text-gray-600 text-sm">Estimated distance: {distance} km</p>
                <p className="text-gray-600 text-sm">Estimated time: {(distance * 4).toFixed(0)} mins</p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
              >
                Continue
              </Button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 w-full">
        <div className="w-full px-6">
          <div className="text-center text-sm text-gray-400">
            <p>© 2000 - Company, Inc. All rights reserved. Address Address</p>
            <div className="mt-1">
              <span className="mx-2">Item 1</span>
              <span className="mx-2">|</span>
              <span className="mx-2">Item 2</span>
              <span className="mx-2">|</span>
              <span className="mx-2">Item 3</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
