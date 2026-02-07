// *********************
// Role of the component: Cart badge that displays item count
// Name of the component: CartBadge.tsx
// Developer: Updated for Zustand integration
// Version: 1.0
// Component call: <CartBadge />
// Input parameters: none
// *********************

"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useProductStore } from "@/app/_zustand/store";

const CartBadge: React.FC = () => {
  // Get cart quantity from Zustand store
  const allQuantity = useProductStore((state) => state.allQuantity);

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      
      {/* Cart Count Badge */}
      {allQuantity > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {allQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;