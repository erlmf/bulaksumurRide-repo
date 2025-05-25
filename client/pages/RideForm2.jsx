import { useState } from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Footer from "@/components/footer";
const LeafletMap = dynamic(() => import("../components/leafletmap3"), { ssr: false });
import { Button } from "@/components/ui/button";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function BulaksumurRide() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("ride");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const fmt = (p) => (p ? `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}` : "");

  // const handleSubmit = () => {
  //   if (!pickup || !dropoff) return;

  //   router.push({
  //     pathname: "/estimation",
  //     query: {
  //       pickup: `${pickup.lat},${pickup.lng}`,
  //       dropoff: `${dropoff.lat},${dropoff.lng}`
  //     }
  //   });
  // };
  const handleSubmit = async () => {
    if (!pickup || !dropoff) {
      alert("Please select both pickup and dropoff locations.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/booking", {
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
        router.push(`/estimation?bookingId=${data.bookingId}`);
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Something went wrong!");
    }
  };
// FETCH FORM THE 

  const [mapKey, setMapKey] = useState(0);

  const handleResetMap = () => {
    setPickup("");
    setDropoff("");
    setMapKey(prevKey => prevKey + 1); // Increment key to force map reload
  };


  return (
    <div className={`${plusJakarta.className} min-h-screen flex flex-col`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">          <h1 className="text-2xl font-bold text-gray-900">
          Bulaksumur<span className="text-blue-900">Ride</span>
        </h1>
          <Button variant="default">
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
          {/* Left Section */}
          <div className="w-full md:w-[50%] flex flex-col justify-center">
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
                  className={`px-4 py-2 rounded-md font-medium w-32 ${activeTab === "ride"
                      ? "bg-blue-900 text-white"
                      : "bg-gray-300 text-black"
                    }`}
                  onClick={() => setActiveTab("ride")}
                >
                  Bulak Ride
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium w-32 ${activeTab === "car"
                      ? "bg-blue-900 text-white"
                      : "bg-gray-300 text-black"
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
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-black font-medium"
                  />
                </div>

                {/* Vertical dotted line */}
                <div className="flex justify-start pl-4">
                  <div className="border-l-2 border-dotted h-6 border-black" />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-3 text-black text-sm">■</span>
                  <input
                    placeholder="Dropoff location"
                    value={fmt(dropoff)}
                    readOnly
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md text-black font-medium"
                  />
                </div>
              </div>              {/* Button */}              <div className="flex flex-row text-center pt-2 px-20 gap-5">
                <Button variant="default" size="default" onClick={handleResetMap}>
                  Reset map
                </Button>
                <Button variant="default" onClick={handleSubmit}>
                  See prices
                </Button>
              </div>
            </div>
          </div>          {/* Right Section - Map */}
          <div className="hidden md:block md:w-[50%]">
            <div className="w-[547px] h-[400px] rounded-xl overflow-hidden shadow-md">
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
