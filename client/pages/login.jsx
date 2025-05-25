import { LoginForm } from "@/components/login-form"
import Header from "@/components/header"
import Image from "next/image";
import Footer from "@/components/footer"
import { Plus_Jakarta_Sans } from "next/font/google";
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// className={`${plusJakarta.className} min-h-screen flex flex-col`}
export default function Page() {
  return (
    <div className={`${plusJakarta.className} min-h-screen flex  flex flex-col bg-white`}>
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full">
        <Header />
      </div>
      
      {/* Main content with proper padding to account for fixed header */}
      <div className="flex pt-24 w-full  md:pt-32 px-4 md:px-10">
        
          <LoginForm />
        
      </div>
      
      {/* Footer */}
      <div className="w-full mt-8">
        <Footer />
      </div>
    </div>
  );
}
