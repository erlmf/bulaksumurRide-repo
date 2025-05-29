import React from 'react'
import {Geist, Geist_Mono} from 'next/font/google'
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
function Header() {
  return (
    <>
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Bulaksumur<span className="text-blue-900">Ride</span>
          </h1>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Login
          </button>
        </div>
      </header>
    </>
  )
}

export default Header
