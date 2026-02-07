// *********************
// Role of the component: Stock availability component for displaying current stock status of the product
// Name of the component: StockAvailabillity.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <StockAvailabillity stock={stock} inStock={inStock} />
// Input parameters: { stock: number, inStock: number }
// Output: styled text that displays current stock status on the single product page
// *********************

import React from 'react'
import { FaCheck } from 'react-icons/fa6'
import { FaXmark } from "react-icons/fa6";
import { AlertCircle } from "lucide-react";

const StockAvailabillity = ({ stock, inStock } : { stock: number, inStock: number }) => {
  // Determine stock status
  const isInStock = inStock === 1;
  const isLowStock = isInStock && stock < 10;

  return (
    <div className="space-y-2">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-neutral-700">Availability:</span>
        {isInStock ? (
          <div className="flex items-center gap-1.5 text-green-600 font-semibold">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span>In Stock</span>
            <FaCheck className="w-4 h-4" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-red-600 font-semibold">
            <div className="w-2 h-2 rounded-full bg-red-600"></div>
            <span>Out of Stock</span>
            <FaXmark className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Low Stock Warning */}
      {isLowStock && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <span className="text-sm text-orange-800">
            Only <span className="font-semibold">{stock} items</span> left in stock!
          </span>
        </div>
      )}

      {/* Out of Stock Message */}
      {!isInStock && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <p className="text-sm text-red-800">
            This item is currently unavailable. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}

export default StockAvailabillity;