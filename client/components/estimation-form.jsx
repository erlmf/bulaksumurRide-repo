// components/ui/estimation-form.jsx
import { useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EstimationForm() {
  const router = useRouter();
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const rideFare = 10000;
  const discount = 0;
  const total = rideFare - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      pickup,
      dropoff,
      paymentMethod,
      estimatedPrice: total,
    };
    console.log("Booking Data:", bookingData);
    router.push("/searching");
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">BulaksumurRide</h1>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm">
            Login
          </button>
        </div>
      </div>

      {/* Main Content - Takes remaining height */}
      <div className="flex-1 flex flex-col w-full px-6 py-4">
        {/* Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-3xl">🛵</span> 
            Bulak <span className="text-blue-600">Ride</span>
          </h2>
        </div>

        {/* Main Layout - Full remaining height */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Top - Total Fare */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total fare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Ride fare</span>
                <span className="font-semibold">Rp {rideFare.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 italic">Discount</span>
                <span className="text-gray-500 italic">Rp {discount}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span>Rp {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Right Top - Map Placeholder */}
          <div className="bg-black rounded-lg h-full w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-black"></div>
          </div>

          {/* Left Bottom - Payment Method */}
          <Card className="bg-white">
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

          {/* Right Bottom - Pickup & Dropoff Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              <Input
                type="text"
                placeholder="Pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="pl-10 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div className="flex justify-start">
              <div className="ml-5 w-px h-6 bg-gray-300"></div>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <div className="w-3 h-3 bg-black"></div>
              </div>
              <Input
                type="text"
                placeholder="Dropoff location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
                className="pl-10 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
            </div>
            <p className="text-gray-600 text-sm">Estimated time: 30 mins</p>
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg font-medium"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>

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
