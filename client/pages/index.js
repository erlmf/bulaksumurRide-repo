import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";
import { Header } from "@/components/header";
import React, { useState } from 'react';
import { Plus_Jakarta_Sans } from "next/font/google";
import RideForm from '../components/RideForm';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
import Footer from "@/components/footer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${plusJakarta.className} min-h-screen flex  flex flex-col bg-white`}>
      {/* Fixed header */}
      
      {/* Main content with proper padding to account for fixed header */}
      <div className="flex pt-24 w-full  md:pt-32 px-4 md:px-10">
        
          <LoginForm />
        
      </div>
      
      {/* Footer */}
      
    </div>
  );
}
