import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";
import { Header } from "@/components/header";
import React, { useState } from 'react';
import RideForm from '../components/RideForm';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col items-center justify-center p-6 sm:p-10 font-sans`}>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
      <div className="w-full max-w-4xl mt-8">
        <RideForm />
      </div>
    </div>
  );
}
