"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Package, Mail, ArrowRight, Home } from "lucide-react";

const OrderCompleteClient = () => {
  // Simple confetti effect without external library
  useEffect(() => {
    // You can add confetti library later: npm install canvas-confetti
    console.log("Order completed!");
  }, []);

  return (
    <>
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-8"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <CheckCircle2 className="w-20 h-20 text-white" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute inset-0 bg-green-400 rounded-full opacity-20"
          />
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-xl text-neutral-600 mb-2">
          Thank you for your purchase
        </p>
        <p className="text-neutral-500">
          Your order has been received and is being processed
        </p>
      </motion.div>

      {/* Order Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 mb-12"
      >
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">
          What happens next?
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                1. Order Confirmation Email
              </h3>
              <p className="text-neutral-600">
                You'll receive a confirmation email with your order details shortly
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                2. Payment Confirmation
              </h3>
              <p className="text-neutral-600">
                Our team will contact you to complete the payment process
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-2">
                3. Order Processing
              </h3>
              <p className="text-neutral-600">
                Once payment is confirmed, we'll prepare your order for shipping
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-200">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-neutral-100 text-neutral-900 rounded-xl font-semibold hover:bg-neutral-200 transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </>
  );
};

export default OrderCompleteClient;