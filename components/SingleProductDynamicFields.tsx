// *********************
// Role of the component: Dynamic client component for product actions
// Name of the component: SingleProductDynamicFields.tsx
// Developer: Redesigned Version
// Version: 3.0
// Component call: <SingleProductDynamicFields product={product} />
// Input parameters: { product: Product }
// Output: Quantity selector, Add to Cart, and Buy Now buttons
// *********************

"use client";
import React, { useState } from "react";
import QuantityInput from "./QuantityInput";
import AddToCartSingleProductBtn from "./AddToCartSingleProductBtn";
import BuyNowSingleProductBtn from "./BuyNowSingleProductBtn";
import { ShoppingCart, Zap, Bell } from "lucide-react";

const SingleProductDynamicFields = ({ product }: { product: Product }) => {
  const [quantityCount, setQuantityCount] = useState<number>(1);
  
  return (
    <div className="space-y-5">
      
      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-semibold text-neutral-900 mb-3">
          Quantity:
        </label>
        <QuantityInput
          quantityCount={quantityCount}
          setQuantityCount={setQuantityCount}
        />
      </div>

      {/* Action Buttons */}
      {Boolean(product.inStock) ? (
        <div className="space-y-3">
          {/* Add to Cart Button */}
          <AddToCartSingleProductBtn
            quantityCount={quantityCount}
            product={product}
          />
          
          {/* Buy Now Button */}
          <BuyNowSingleProductBtn
            quantityCount={quantityCount}
            product={product}
          />

          {/* Quick Info */}
          <div className="flex items-center gap-4 text-sm text-neutral-600 pt-2">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cash on delivery available</span>
            </div>
          </div>
        </div>
      ) : (
        /* Out of Stock */
        <div className="space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4 text-center">
            <p className="text-red-700 font-semibold mb-2">This product is currently out of stock</p>
            <p className="text-sm text-red-600">We'll notify you when it's back in stock</p>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-200 transition-colors border border-neutral-300">
            <Bell className="w-5 h-5" />
            <span>Notify Me When Available</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleProductDynamicFields;