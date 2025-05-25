import { LoginForm } from "@/components/login-form"
import Header from "@/components/header"
import Image from "next/image";
import Footer from "@/components/footer"
import { SignUpForm } from "@/components/signup-form";
export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full z-40">
        <Header />
      </div>
      
      {/* Main content with proper padding to account for fixed header */}
      <div className="flex-1 w-full pt-24 md:pt-32 px-4 md:px-10">
        <div className="w-full max-w-7xl mx-auto pt-10">
          <SignUpForm className="w-full max-w-md" />
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full mt-8"> 
        <Footer />
      </div>
    </div>
  );
}
