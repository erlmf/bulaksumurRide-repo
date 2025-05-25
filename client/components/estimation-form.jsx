import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import footer from "@/components/footer";
import Footer from "@/components/footer";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("../components/leafletmap3"), { ssr: false });
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
      // Store the original coordinate strings
      setPickup(pickupQuery);
      setDropoff(dropoffQuery);

      // Parse coordinates for calculations
      const [pLat, pLng] = pickupQuery.split(",").map(Number);
      const [dLat, dLng] = dropoffQuery.split(",").map(Number);

      // Calculate distance and fare
      const pickupCoord = { lat: pLat, lng: pLng };
      const dropoffCoord = { lat: dLat, lng: dLng };
      const dist = haversine(pickupCoord, dropoffCoord);

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
    <div className="min-h-screen w-full flex flex-col bg-gray-50">      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bulaksumur<span className="text-blue-900">Ride</span>
          </h1>
          <Button variant="default">
            Login
          </Button>
        </div>
      </header>


      {/* Main Content */}
      <main className="flex-grow w-full flex flex-col items-center">
        <div className="w-full max-w-screen-xl px-6 py-6 flex flex-col gap-4">

          {/* Title */}
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
            <div className="hidden md:block md:w-[50%]">
              <div className="w-[610px] h-[300px] rounded-xl overflow-hidden shadow-md">
                <LeafletMap
                  centre={[-7.770, 110.378]}
                  zoom={16}
                  enableSelect={false}
                  routeCoords={
                    pickupQuery && dropoffQuery
                      ? [
                        pickupQuery.split(',').map(Number),
                        dropoffQuery.split(',').map(Number)
                      ]
                      : null
                  }
                />
              </div>
            </div>            <Card className="bg-white h-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Trip Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-700 font-medium">Pickup Location</span>
                  <span className="text-sm bg-gray-50 p-2 rounded">{pickupQuery}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-700 font-medium">Drop-off Location</span>
                  <span className="text-sm bg-gray-50 p-2 rounded">{dropoffQuery}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Distance</span>
                  <span className="font-medium">{distance} km</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Estimated Time</span>
                  <span className="font-medium">{Math.ceil(distance * 4)} mins</span>
                </div>
              </CardContent>
            </Card>

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
              <Button
                type="submit"
                variant="default"
                className="w-full"
              >
                Continue
              </Button>
            </form>
          </div>


        </div>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
