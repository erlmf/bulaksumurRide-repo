import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import { Footer } from "@/components/footer";
import SkeletonCard from "@/components/skeleton-card";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useGetStreetName } from "@/hooks/useGetStreetName";
import ErrorBoundary from "@/components/ErrorBoundary";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const LeafletMap = dynamic(() => import("@/components/leafletmap3"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      Loading map...
    </div>
  ),
});

export default function rideBook() {
  const router = useRouter();
  const { pickup: pickupQuery, dropoff: dropoffQuery } = router.query;

  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoordinates, setPickupCoordinates] = useState({ lat: null, lng: null });
  const [dropoffCoordinates, setDropoffCoordinates] = useState({ lat: null, lng: null });
  const [paymentMethod] = useState("Cash");
  const [distance, setDistance] = useState(0);
  const [fare, setFare] = useState(0);
  const [mapCenter, setMapCenter] = useState([-7.770, 110.378]);
  const [routeCoords, setRouteCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [driver, setDriver] = useState({
    name: "John Doe",
    licensePlate: "AB 1234 XY",
    vehicleType: "Honda BeAT",
    rating: "4.8",
    phoneNumber: "+62 812-3456-7890",
  });

  const { streetName: pickupName, error: pickupError } = useGetStreetName(pickupCoordinates.lat, pickupCoordinates.lng);
  const { streetName: dropoffName, error: dropoffError } = useGetStreetName(dropoffCoordinates.lat, dropoffCoordinates.lng);

  // Validate coordinates function
  const validateCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return false;
    }

    const [lat, lng] = coordinates;
    return (
      !isNaN(parseFloat(lat)) &&
      !isNaN(parseFloat(lng)) &&
      parseFloat(lat) >= -90 &&
      parseFloat(lat) <= 90 &&
      parseFloat(lng) >= -180 &&
      parseFloat(lng) <= 180
    );
  };

  useEffect(() => {
    if (!router.isReady) return;

    setIsLoading(true);
    setError(null);

    if (!pickupQuery || !dropoffQuery) {
      setIsLoading(false);
      setError("Missing pickup or dropoff coordinates in the URL");
      return;
    }

    try {
      const pickupCoords = pickupQuery.toString().split(",").map((coord) => parseFloat(coord.trim()));
      const dropoffCoords = dropoffQuery.toString().split(",").map((coord) => parseFloat(coord.trim()));

      // Validate coordinates
      if (!validateCoordinates(pickupCoords) || !validateCoordinates(dropoffCoords)) {
        throw new Error("Invalid coordinates format");
      }

      const [pLat, pLng] = pickupCoords;
      const [dLat, dLng] = dropoffCoords;

      setPickup(`${pLat}, ${pLng}`);
      setDropoff(`${dLat}, ${dLng}`);
      setPickupCoordinates({ lat: pLat, lng: pLng });
      setDropoffCoordinates({ lat: dLat, lng: dLng });
      setMapCenter([pLat, pLng]);
      setRouteCoords([pickupCoords, dropoffCoords]);

      // Fetch fare estimation with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      fetch("http://localhost:5050/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: { lat: pLat, lng: pLng },
          dropoff: { lat: dLat, lng: dLng },
        }),
        signal: controller.signal,
      })
        .then((res) => {
          clearTimeout(timeoutId);
          if (!res.ok) {
            throw new Error(`Server responded with status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setDistance(data.distance);
          setFare(data.fare);
          setIsLoading(false);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          console.error("❌ Failed to fetch fare estimation:", err);
          setError(
            err.name === "AbortError"
              ? "Request timeout: Server took too long to respond"
              : `Error estimating fare: ${err.message}`
          );
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error parsing coordinates:", error);
      setError(`Error parsing coordinates: ${error.message}`);
      setIsLoading(false);
    }
  }, [pickupQuery, dropoffQuery, router.isReady]);

  useEffect(() => {
    if (!pickup || !dropoff) return;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    fetch(`http://localhost:5050/api/drivers/match?pickup=${pickup}&dropoff=${dropoff}`, {
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.driver) {
          setDriver(data.driver);
          if (data.driver.currentLocation?.coordinates) {
            setMapCenter([
              data.driver.currentLocation.coordinates[1],
              data.driver.currentLocation.coordinates[0],
            ]);
          }
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.error("❌ Failed to fetch matched driver:", err);
        // We don't set a global error here since this is not critical - just use the default driver
      });
  }, [pickup, dropoff]);

  // Function to handle retry
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    router.replace(router.asPath);
  };

  return (
    <ErrorBoundary errorMessage="There was an error loading the ride booking page. Please try again.">
      <div className={`${plusJakarta.className} min-h-screen w-full flex flex-col bg-gray-50`}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Bulaksumur<span className="text-blue-900">Ride</span>
            </h1>
            <Button variant="default">Login</Button>
          </div>
        </header>

        <main className="flex-grow w-full flex flex-col items-center justify-center py-8">
          <div className="w-full max-w-6xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 justify-center">
                <span className="text-3xl">🛵</span>
                Bulak <span className="text-blue-600">Ride</span>
              </h2>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error}
                  <div className="mt-2">
                    <Button onClick={handleRetry} variant="outline" size="sm">
                      Try Again
                    </Button>
                    <Button
                      onClick={() => router.push("/")}
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                    >
                      Return Home
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading ride details...</p>
                </div>
              </div>
            ) : !error && (
              <div className="flex gap-6 justify-center">
                <div className="w-[500px] space-y-4">
                  <Card className="bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Map View</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full rounded-lg overflow-hidden">
                        <ErrorBoundary errorMessage="Could not load the map. Please refresh the page.">
                          <LeafletMap
                            centre={mapCenter}
                            zoom={15}
                            routeCoords={routeCoords}
                            driverMarkers={driver.currentLocation ? [driver] : []}
                          />
                        </ErrorBoundary>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Trip Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 font-medium">Pickup Location</span>
                        <span className="text-sm bg-gray-50 p-2 rounded">
                          {pickupError ? pickup : pickupName || pickup}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-700 font-medium">Drop-off Location</span>
                        <span className="text-sm bg-gray-50 p-2 rounded">
                          {dropoffError ? dropoff : dropoffName || dropoff}
                        </span>
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

                <div className="w-[400px] space-y-5">
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

                  <Card className="bg-white shadow-md">
                    <CardHeader className="border-b pb-4">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <span>📍</span>
                        Ride Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <SkeletonCard />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>

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
    </ErrorBoundary>
  );
}
