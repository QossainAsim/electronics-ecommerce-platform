// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-10 lg:gap-16">
          {/* Content Section */}
          <div className="col-span-1 lg:col-span-2 space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase">
                  New Arrival
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl xl:text-7xl text-white font-bold leading-tight">
                THE PRODUCT OF THE{" "}
                <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                  FUTURE
                </span>
              </h1>
              
              <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience innovation at its finest. Cutting-edge technology meets elegant design 
                to bring you the ultimate smart experience.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className={cn(
                "group relative px-8 py-4 bg-white text-blue-600 font-bold rounded-lg",
                "hover:bg-gray-50 transition-all duration-300",
                "shadow-xl hover:shadow-2xl hover:scale-105",
                "text-lg"
              )}>
                <span className="relative z-10">BUY NOW</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </button>
              
              <button className={cn(
                "group px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg",
                "border-2 border-white/30 hover:bg-white/20 transition-all duration-300",
                "hover:border-white/50 hover:scale-105",
                "text-lg"
              )}>
                LEARN MORE
              </button>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">2 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-span-1 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
              
              {/* Product image */}
              <div className="relative transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Image
                  src="/watch for banner.png"
                  width={450}
                  height={450}
                  alt="smart watch"
                  className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[450px] lg:h-[450px] object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-bounce">
                30% OFF
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;

// Add these animations to your app/globals.css file:
/*
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
*/