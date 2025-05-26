import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const LeafletMap = dynamic(() => import("@/components/leafletmap3"), { ssr: false });

export function rideBook() {
    const router = useRouter();
    const { pickup: pickupQuery, dropoff: dropoffQuery } = router.query;

    const [pickup, setPickup] = useState("");
    const [dropoff, setDropoff] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [distance, setDistance] = useState(0);
    const [fare, setFare] = useState(0);
    const [mapCenter, setMapCenter] = useState([-7.770, 110.378]);
    const [routeCoords, setRouteCoords] = useState(null);
    const [driver, setDriver] = useState({
        name: "John Doe",
        licensePlate: "AB 1234 XY",
        vehicleType: "Honda BeAT",
        rating: "4.8",
        phoneNumber: "+62 812-3456-7890"
    });

    useEffect(() => {
        if (pickupQuery && dropoffQuery) {
            try {
                const pickupCoords = pickupQuery.toString().split(",").map(coord => parseFloat(coord.trim()));
                const dropoffCoords = dropoffQuery.toString().split(",").map(coord => parseFloat(coord.trim()));

                // Validate coordinates
                if (pickupCoords.length === 2 && dropoffCoords.length === 2 &&
                    !pickupCoords.some(isNaN) && !dropoffCoords.some(isNaN)) {

                    const [pLat, pLng] = pickupCoords;
                    const [dLat, dLng] = dropoffCoords;

                    setPickup(`${pLat}, ${pLng}`);
                    setDropoff(`${dLat}, ${dLng}`);
                    setMapCenter([pLat, pLng]);
                    setRouteCoords([pickupCoords, dropoffCoords]);

                    console.log("🔥 Sending to /api/estimate:", {
                        pickup: { lat: pLat, lng: pLng },
                        dropoff: { lat: dLat, lng: dLng }
                    });

                    fetch("http://localhost:5050/api/estimate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            pickup: { lat: pLat, lng: pLng },
                            dropoff: { lat: dLat, lng: dLng },
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log("✅ Response from /api/estimate:", data);
                            setDistance(data.distance);
                            setFare(data.fare);
                        })
                        .catch((err) => console.error("❌ Failed to fetch fare estimation:", err));
                } else {
                    console.error("Invalid coordinates:", { pickupQuery, dropoffQuery });
                }
            } catch (error) {
                console.error("Error parsing coordinates:", error);
            }
        }
    }, [pickupQuery, dropoffQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const pickupCoords = pickup.split(",").map(coord => parseFloat(coord.trim()));
            const dropoffCoords = dropoff.split(",").map(coord => parseFloat(coord.trim()));

            if (pickupCoords.some(isNaN) || dropoffCoords.some(isNaN)) {
                alert("Invalid coordinates. Please try again.");
                return;
            }

            const [pLat, pLng] = pickupCoords;
            const [dLat, dLng] = dropoffCoords;

            const res = await fetch("http://localhost:5000/api/findDriver", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pickup: { lat: pLat, lng: pLng },
                    paymentMethod,
                    
                }),
            });

            const data = await res.json();
            if (data.bookingId) {
                router.push(`/summary?bookingId=${data.bookingId}`);
            } else {
                alert("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className={`${plusJakarta.className} min-h-screen w-full flex flex-col bg-gray-50`}>
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
            <main className="flex-grow w-full flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-6xl mx-auto px-4">
                    {/* Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
                            <span className="text-3xl">🛵</span>
                            Bulak <span className="text-blue-600">Ride</span>
                        </h2>
                    </div>

                    <div className="flex gap-6 justify-center">
                        {/* Left Column */}
                        <div className="w-[500px] space-y-4">
                            {/* Map View */}
                            <Card className="bg-white shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Map View</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px] w-full rounded-lg overflow-hidden">
                                        <LeafletMap
                                            centre={mapCenter}
                                            zoom={15}
                                            routeCoords={routeCoords}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trip Details */}
                            <Card className="bg-white shadow-md">
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
                                        <span className="text-gray-700">Estimated Time to</span>
                                        <span className="font-medium">{Math.ceil(distance * 4)} mins</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Driver Info */}
                        <div className="w-[400px]">
                            <Card className="bg-white shadow-md">
                                <CardHeader className="border-b pb-4">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <span>👨‍✈️</span>
                                        Driver Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-blue-100">
                                            <span className="text-3xl">👤</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-xl text-gray-900">{driver.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-yellow-500">⭐</span>
                                                <span className="text-gray-600 font-medium">{driver.rating}</span>
                                                <span className="text-gray-400 text-sm">(523 trips)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">🛵</span>
                                                <span className="text-gray-600">Vehicle</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{driver.vehicleType}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">🔢</span>
                                                <span className="text-gray-600">License Plate</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{driver.licensePlate}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-400">📱</span>
                                                <span className="text-gray-600">Phone</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{driver.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <Button className="w-full" variant="outline">
                                            <span className="mr-2">💬</span>
                                            Message
                                        </Button>
                                        <Button className="w-full" variant="default">
                                            <span className="mr-2">📞</span>
                                            Call
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
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

export default rideBook;
