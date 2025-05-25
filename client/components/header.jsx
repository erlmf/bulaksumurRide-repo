import React from 'react'
import {Geist, Geist_Mono} from 'next/font/google'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
function Header() {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans flex w-full items-center justify-start py-3 px-6 md:py-4 md:px-10 bg-white z-40 border-2 border-solid `}>
        <h1 className="text-black text-2xl md:text-4xl font-bold">BulaksumurRide</h1>
    </div>
  )
}

export default Header
