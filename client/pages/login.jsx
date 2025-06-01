import { LoginForm } from "@/components/login-form"
import Header from "@/components/header"
import Image from "next/image";
import Footer from "@/components/footer"
import { Plus_Jakarta_Sans } from "next/font/google";
import { Button } from "@/components/ui/button";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// className={`${plusJakarta.className} min-h-screen flex flex-col`}
export default function Page() {
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
            <LoginForm />
          </main>
    
          {/* Footer */}
          <Footer />
        </div>
  );
}
