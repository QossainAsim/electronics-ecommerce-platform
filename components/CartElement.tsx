// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from "next/link";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
  const { allQuantity } = useProductStore();

  return (
    <Link
      href="/cart"
      className="relative group p-2 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
    >
      <ShoppingCart className="h-6 w-6 text-neutral-700 group-hover:text-blue-600 transition-colors" />
      {allQuantity > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-lg">
          {allQuantity > 99 ? "99+" : allQuantity}
        </span>
      )}
    </Link>
  );
};

export default CartElement;