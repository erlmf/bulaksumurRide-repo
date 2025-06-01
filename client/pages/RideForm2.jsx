import { useState } from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Footer from "@/components/footer";
const LeafletMap = dynamic(() => import("../components/leafletmap3"), { ssr: false });
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BulaksumurRide() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ride");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [mapKey, setMapKey] = useState(0); // Add mapKey state
  const [pickUpName, setPickUpName] = useState('');
  const [dropOffName, setDropOffName] = useState('');

  const fmt = (p) => (p ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : "");

  const handleSubmit = async () => {
    if (!pickup || !dropoff) {
      alert("Please select both pickup and dropoff locations.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5050/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup,
          dropoff,
          paymentMethod: "Cash",
        }),
      });

      const data = await res.json();
      if (data.bookingId) {
        // ⬇️ Redirect ke estimation dengan koordinat, bukan bookingId
        router.push(`/estimation?pickup=${pickup.lat},${pickup.lng}&dropoff=${dropoff.lat},${dropoff.lng}`);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong!");
    }
  };

  const handleResetMap = () => {
    setPickup("");
    setDropoff("");
    setMapKey(prevKey => prevKey + 1);
  };

  const randomCoordds = (lat, lon, radius) => {
    const r = radius / 111300;
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const newLat = lat + w * Math.cos(t);
    const newLon = lon + w * Math.sin(t) / Math.cos(lat * Math.PI / 180);
    return { lat: newLat.toFixed(6), lng: newLon.toFixed(6) };
  }

  const driverCoords = [
    [-7.768, 110.376],
    [-7.772, 110.380],
    [-7.771, 110.375],
    [-7.769, 110.381],
    [-7.7702, 110.3771],
    [-7.7709, 110.3765],
    [-7.7715, 110.3793],
    [-7.7722, 110.3777],
    [-7.7685, 110.3788],
    [-7.7699, 110.3749],
    [-7.7718, 110.3769],
    [-7.7675, 110.3773],
    [-7.7703, 110.3802],
    [-7.7711, 110.3820],
    [-7.7725, 110.3781],
    [-7.7695, 110.3770],
    [-7.7688, 110.3794],
    [-7.7700, 110.3800],
    [-7.7690, 110.3762],
    [-7.7682, 110.3755],
    [-7.7712, 110.3747],
    [-7.7727, 110.3798],
    [-7.7678, 110.3803],
    [-7.7708, 110.3783]
  ];

  // Remove the console.log statements or make them more meaningful
  console.log("Pickup location name:", pickUpName);
  console.log("Dropoff location name:", dropOffName);

  // Add this debug function
  const handleStreetNames = (names) => {
    console.log("Street names received:", names);
    if (names && names.pickup) {
      console.log("Setting pickup name to:", names.pickup);
      setPickUpName(names.pickup);
    }
    if (names && names.dropoff) {
      console.log("Setting dropoff name to:", names.dropoff);
      setDropOffName(names.dropoff);
    }
  };
  //names will contain the json object with the pickup and dropoff street

  return (
    <div className={`${plusJakarta.className} min-h-screen flex flex-col bg-gray-50`}>
      {/* Header */}
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
      <main className="flex-1 py-12 bg-gray-50 flex items-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10 w-full">
          {/* Left Section */}
          <div className="w-full md:w-[50%] flex flex-col justify-center">
            <Card className="bg-white shadow-md rounded-xl p-6">
              <div className="max-w-md mx-auto w-full space-y-6">
                <Image
                  src="/images/car 1.png"
                  alt="car icon"
                  className="mx-auto"
                  width={120}
                  height={120}
                />

                <h2 className="text-2xl font-bold text-center">
                  <span className="text-black">Ride safe, arrive </span>
                  <span className="text-blue-900">fast.</span>
                </h2>

                {/* Tabs */}
                <div className="flex justify-center gap-2">
                  <button
                    className={`px-4 py-2 rounded-md font-medium w-32 transition-colors duration-150 ${activeTab === "ride"
                      ? "bg-blue-900 text-white shadow"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    onClick={() => setActiveTab("ride")}
                  >
                    Bulak Ride
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md font-medium w-32 transition-colors duration-150 ${activeTab === "car"
                      ? "bg-blue-900 text-white shadow"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                      }`}
                    onClick={() => setActiveTab("car")}
                  >
                    Bulak Car
                  </button>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-black text-sm">⬤</span>
                    <input
                      placeholder="Pickup location"
                      value={pickUpName ? `${pickUpName} (${fmt(pickup)})` : fmt(pickup)}
                      readOnly
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-black font-medium bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />

                  </div>
                  {/* <div className="flex justify-start pl-4">
                    <div className="border-l-2 border-dotted h-6 border-black" />
                  </div> */}
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-black text-sm">■</span>
                    <input
                      placeholder="Dropoff location"
                      value={dropOffName ? `${dropOffName} (${fmt(dropoff)})` : fmt(dropoff)}
                      readOnly
                      className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-black font-medium bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-row text-center pt-2 px-4 gap-5">
                  <Button
                    variant="secondary"
                    size="default"
                    className="w-1/2 rounded-lg"
                    onClick={handleResetMap}
                  >
                    Reset map
                  </Button>
                  <Button
                    variant="default"
                    className="w-1/2 rounded-lg bg-blue-900 hover:bg-blue-800"
                    onClick={handleSubmit}
                  >
                    See prices
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="hidden md:block md:w-[50%]">
            <Card className="bg-white shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Map View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full rounded-lg overflow-hidden">
                  <LeafletMap
                    key={mapKey}
                    centre={[-7.770, 110.378]}
                    zoom={16}
                    enableSelect
                    onPickupSet={setPickup}
                    onDestinationSet={setDropoff}
                    onStreetNameFound={handleStreetNames}
                    routeCoords={
                      pickup && dropoff
                        ? [
                          [pickup.lat, pickup.lng],
                          [dropoff.lat, dropoff.lng],
                        ]
                        : null
                    }
                    driverCoords={driverCoords}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
