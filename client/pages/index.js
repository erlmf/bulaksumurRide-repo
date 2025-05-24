import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/login-form";

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
    <main className={`${geistSans.variable} ${geistMono.variable} font-sans flex min-h-svh w-full items-center justify-center p-6 md:p-10`}>
      <div className="w-full max-w-sm">
        <LoginForm className="w-full max-w-md" />
      </div>
    </main>
  );
}
