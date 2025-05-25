import { useState } from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // atau sesuai kebutuhan
});

export default function BulaksumurRide() {
  const [activeTab, setActiveTab] = useState("ride");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  const handleSubmit = () => {
    alert(`Pickup: ${pickup}\nDropoff: ${dropoff}`);
  };

  return (
    <div className={`${plusJakarta.className} min-h-screen flex flex-col`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bulaksumur<span className="text-blue-900">Ride</span>
          </h1>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Login
          </button>
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
                <span style={{ color: 'black' }}>Ride safe, arrive </span>
                <span className="text-blue-900">fast.</span>
              </h2>

              {/* Tabs */}
              <div className="flex justify-center gap-2">
                <button
                  className={`px-4 py-2 rounded-md font-medium w-32 ${
                    activeTab === "ride"
                      ? "bg-blue-900 text-white"
                      : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setActiveTab("ride")}
                >
                  Bulak Ride
                </button>
                <button
                  className={`px-4 py-2 rounded-md font-medium w-32 ${
                    activeTab === "car"
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
                    type="text"
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* Vertical dotted line */}
                <div className="flex justify-start pl-4">
                  <div className="border-l-2 border-dotted h-6 border-black" />
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-3 text-black text-sm">■</span>
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="text-center pt-2">
                <button
                  onClick={handleSubmit}
                  className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                >
                  See prices
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Map */}
          <div className="hidden md:block md:w-[50%]">
            <div className="w-[547px] h-[547px] rounded-xl overflow-hidden shadow-md">
              <iframe
                title="Google Maps"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.878204663312!2d110.37052997486036!3d-7.801373377960775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59942a94f3eb%3A0x61d9df55f238e3e9!2sUniversitas%20Gadjah%20Mada!5e0!3m2!1sen!2sid!4v1716612345678"
              ></iframe>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1E2A3A] text-white py-6">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <div className="text-gray-400">
            © 2000 - Company, Inc. All rights reserved. Address Address
          </div>
          <div className="text-xs text-gray-500 mt-1">Item 1 | Item 2 | Item 3</div>
        </div>
      </footer>
    </div>
  );
}
