// *********************
// Role of the component: Topbar of the header
// Name of the component: HeaderTop.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeaderTop />
// Input parameters: no input parameters
// Output: topbar with phone, email and login and register links
// *********************

"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { FaHeadphones, FaRegEnvelope, FaRegUser } from "react-icons/fa6";

const HeaderTop = () => {
  const { data: session }: any = useSession();

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b border-blue-400">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-10 lg:h-12 max-lg:flex-col max-lg:h-auto max-lg:py-2 max-lg:gap-2">
          {/* Left side - Contact info */}
          <ul className="flex items-center gap-4 lg:gap-6 text-sm max-[370px]:text-xs max-[370px]:gap-2">
            <li className="flex items-center gap-2 hover:text-blue-100 transition-colors">
              <FaHeadphones className="text-base" />
              <span className="font-medium">+381 61 123 321</span>
            </li>
            <li className="flex items-center gap-2 hover:text-blue-100 transition-colors max-sm:hidden">
              <FaRegEnvelope className="text-base" />
              <span className="font-medium">test@email.com</span>
            </li>
          </ul>

          {/* Right side - Auth links */}
          <ul className="flex items-center gap-4 lg:gap-6 text-sm max-[370px]:text-xs max-[370px]:gap-2">
            {!session ? (
              <>
                <li>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 font-medium hover:text-blue-100 transition-colors"
                  >
                    <FaRegUser className="text-base" />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-1.5 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                  >
                    <FaRegUser className="text-sm" />
                    <span>Register</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2 max-sm:hidden">
                  <FaRegUser className="text-base" />
                  <span className="font-medium truncate max-w-[150px]">
                    {session.user?.email}
                  </span>
                </li>
                <li>
                  <button
                    onClick={() => handleLogout()}
                    className="flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full font-medium hover:bg-white/20 transition-all duration-200 hover:scale-105"
                  >
                    <span>Log out</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;