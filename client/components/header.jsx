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
    <div className={`${geistSans.variable} ${geistMono.variable} font-sans flex w-full items-center justify-start p-6 md:p-10 bg-white z-40 border-2 border-solid fixed top-0 left-0`}>
        <h1 className="text-black text-3xl md:text-5xl font-bold">BulaksumurRide</h1>
    </div>
  )
}

export default Header
