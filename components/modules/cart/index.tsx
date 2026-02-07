"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {

  const { products, removeFromCart, calculateTotals, total } =
    useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };

  const shippingCost = 500; // PKR 500 shipping
  // ✅ Removed tax calculation
  const orderTotal = total > 0 ? total + shippingCost : 0;

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">Shopping Cart</h1>
          <p className="text-neutral-600 mt-2">
            {products.length === 0 ? "Your cart is empty" : `${products.length} ${products.length === 1 ? 'item' : 'items'} in your cart`}
          </p>
        </div>

        {products.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-neutral-100 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-neutral-400" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-3">Your cart is empty</h2>
            <p className="text-neutral-600 mb-8">Add some products to get started!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Shopping</span>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-7 space-y-4">
              {products.map((product) => {
                // ✅ Calculate discounted price if deal exists
                const originalPrice = product.price;
                const hasActiveDeal = product.deal && product.deal.discountPercent > 0;
                const discountedPrice = hasActiveDeal 
                  ? originalPrice * (1 - (product.deal!.discountPercent / 100))
                  : originalPrice;
                const finalPrice = discountedPrice;

                return (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
                    <div className="flex gap-4 lg:gap-6">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 lg:w-32 lg:h-32 bg-neutral-50 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          fill
                          src={product?.image ? (product.image.startsWith('/') ? product.image : `/${product.image}`) : "/product_placeholder.jpg"}
                          alt={sanitize(product.title)}
                          className="object-contain p-2"
                        />
                        {/* ✅ Discount Badge */}
                        {hasActiveDeal && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            {product.deal!.discountPercent}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">
                              <Link
                                href={`#`}
                                className="hover:text-blue-600 transition-colors"
                              >
                                {sanitize(product.title)}
                              </Link>
                            </h3>
                            
                            {/* Stock Status */}
                            <div className="flex items-center gap-1.5 text-sm mt-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-green-600 font-medium">In Stock</span>
                            </div>

                            {/* ✅ Price with Discount */}
                            <div className="flex items-center gap-2">
                              <p className="text-xl lg:text-2xl font-bold text-blue-600">
                                Rs. {finalPrice.toLocaleString()}
                              </p>
                              {hasActiveDeal && (
                                <>
                                  <p className="text-sm lg:text-base text-neutral-400 line-through">
                                    Rs. {originalPrice.toLocaleString()}
                                  </p>
                                  <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded">
                                    Save {product.deal!.discountPercent}%
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Remove Button - Desktop */}
                          <button
                            onClick={() => handleRemoveItem(product.id)}
                            type="button"
                            className="hidden lg:flex items-center justify-center w-10 h-10 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Quantity and Remove */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                          <QuantityInputCart product={product} />
                          
                          <button
                            onClick={() => handleRemoveItem(product.id)}
                            type="button"
                            className="lg:hidden flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                  Order Summary
                </h2>

                {/* Summary Items */}
                <div className="space-y-4 pb-4 border-b border-neutral-200">
                  <div className="flex justify-between text-base">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold text-neutral-900">Rs. {total.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-base">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-semibold text-neutral-900">Rs. {shippingCost.toLocaleString()}</span>
                  </div>
                  
                  {/* ✅ Removed Tax */}
                </div>

                {/* Order Total */}
                <div className="flex justify-between pt-4 mb-6">
                  <span className="text-xl font-bold text-neutral-900">Order Total</span>
                  <span className="text-2xl font-bold text-blue-600">Rs. {orderTotal.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl mb-4"
                >
                  <span>Proceed to Checkout</span>
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-900 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}