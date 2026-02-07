// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeartElement />
// Input parameters: no input parameters
// Output: wishlist icon with quantity
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { Heart } from "lucide-react";

const HeartElement = ({ wishQuantity }: { wishQuantity: number }) => {
  return (
    <Link
      href="/wishlist"
      className="relative group p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
    >
      <Heart className="h-6 w-6 text-neutral-700 group-hover:text-red-500 group-hover:fill-red-500 transition-all" />
      {wishQuantity > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg">
          {wishQuantity > 99 ? "99+" : wishQuantity}
        </span>
      )}
    </Link>
  );
};

export default HeartElement;