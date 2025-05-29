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
                    className={`px-4 py-2 rounded-md font-medium w-32 transition-colors duration-150 ${
                      activeTab === "ride"
                        ? "bg-blue-900 text-white shadow"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                    onClick={() => setActiveTab("ride")}
                  >
                    Bulak Ride
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md font-medium w-32 transition-colors duration-150 ${
                      activeTab === "car"
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
                      value={fmt(pickup)}
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
                      value={fmt(dropoff)}
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
          {/* Right Section - Map */}
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
                    routeCoords={
                      pickup && dropoff
                        ? [
                            [pickup.lat, pickup.lng],
                            [dropoff.lat, dropoff.lng],
                          ]
                        : null
                    }
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
