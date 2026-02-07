// *********************
// Role of the component: Modal that appears after adding product to cart with action options
// Name of the component: AddToCartModal.tsx
// Developer: Enhanced with ₨ currency
// Version: 2.1
// Component call: <AddToCartModal isOpen={isOpen} onClose={onClose} product={product} quantity={quantity} />
// Input parameters: isOpen, onClose, product, quantity
// Output: Modal with cart actions
// *********************

"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ShoppingCart, ArrowRight, CheckCircle } from "lucide-react";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

const AddToCartModal = ({ isOpen, onClose, product, quantity }: AddToCartModalProps) => {
  if (!isOpen) return null;

  // ✅ Calculate displayed price (use discounted price if deal exists)
  const displayPrice = product.deal 
    ? product.price * (1 - product.deal.discountPercent / 100)
    : product.price;

  // ✅ Fix image path - add leading slash if missing
  const imageSrc = product.mainImage 
    ? (product.mainImage.startsWith('/') ? product.mainImage : `/${product.mainImage}`)
    : "/placeholder.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Added to Cart!</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            {/* Product Image */}
            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover"
              />
              {product.deal && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  -{product.deal.discountPercent}%
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                {product.title}
              </h4>
              <div className="space-y-1">
                {product.deal ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-blue-600">
                        ₨{displayPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₨{product.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-medium">
                      You save ₨{(product.price - displayPrice).toLocaleString()} ({product.deal.discountPercent}%)
                    </div>
                  </>
                ) : (
                  <span className="text-xl font-bold text-gray-900">
                    ₨{product.price.toLocaleString()}
                  </span>
                )}
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
            </div>
          </div>

          {/* Subtotal */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'})</span>
              <span className="text-2xl font-bold text-gray-900">
                ₨{(displayPrice * quantity).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
            </Link>
            
            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;