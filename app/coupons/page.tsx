'use client';

import React, { useState, useEffect } from 'react';
import { Tag, Calendar, Percent, DollarSign, Copy, Check, Sparkles, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from '@/components/SectionTitle';

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons/active');
      const data = await response.json();
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatExpiry = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-purple-50">
      <SectionTitle title="Active Coupons" path="Home | Coupons" />
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl"></div>
              <Sparkles className="w-20 h-20 relative" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100"
          >
            Exclusive Coupon Codes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto"
          >
            Unlock amazing savings with our premium discount codes
          </motion.p>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">{coupons.length}</div>
              <div className="text-sm opacity-80">Active Codes</div>
            </div>
            <div className="w-px bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">Up to 50%</div>
              <div className="text-sm opacity-80">Savings</div>
            </div>
            <div className="w-px bg-white opacity-30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold">Limited</div>
              <div className="text-sm opacity-80">Time Only</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-16">
        {loading ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
            ></motion.div>
            <p className="text-gray-600 mt-4 text-lg">Loading exclusive deals...</p>
          </div>
        ) : coupons.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-16 text-center"
          >
            <Tag className="w-32 h-32 mx-auto text-gray-300 mb-6" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              No Active Coupons Right Now
            </h2>
            <p className="text-gray-600 text-lg">
              Check back soon for amazing deals!
            </p>
          </motion.div>
        ) : (
          <>
            {/* Coupons Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {coupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CouponCard
                    coupon={coupon}
                    onCopy={copyCode}
                    isCopied={copiedCode === coupon.code}
                  />
                </motion.div>
              ))}
            </div>

            {/* How to Use Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
                <h2 className="text-3xl font-bold mb-2">How to Use Coupon Codes</h2>
                <p className="opacity-90">Simple steps to unlock your savings</p>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-4 gap-8">
                  {[
                    {
                      step: 1,
                      title: "Copy Code",
                      description: "Click on any coupon card to instantly copy the code",
                      icon: Copy,
                      color: "blue"
                    },
                    {
                      step: 2,
                      title: "Shop Products",
                      description: "Browse and add your favorite items to cart",
                      icon: Tag,
                      color: "purple"
                    },
                    {
                      step: 3,
                      title: "Apply at Checkout",
                      description: "Paste your code in the coupon field during checkout",
                      icon: Check,
                      color: "pink"
                    },
                    {
                      step: 4,
                      title: "Save Money!",
                      description: "Enjoy instant discounts on your order",
                      icon: Sparkles,
                      color: "green"
                    }
                  ].map((item) => (
                    <div key={item.step} className="text-center group">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all`}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-${item.color}-500 flex items-center justify-center`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                      <div className="text-2xl font-bold text-gray-800 mb-2">{item.step}</div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

// Premium Coupon Card Component
function CouponCard({
  coupon,
  onCopy,
  isCopied,
}: {
  coupon: Coupon;
  onCopy: (code: string) => void;
  isCopied: boolean;
}) {
  const isPercentage = coupon.discountType === 'percentage';
  const discountDisplay = isPercentage
    ? `${coupon.discountValue}%`
    : `$${coupon.discountValue}`;

  const daysUntilExpiry = Math.ceil(
    (new Date(coupon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilExpiry <= 7;
  const remainingCoupons = coupon.usageLimit - coupon.usedCount;
  const isLowStock = remainingCoupons <= 10;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative bg-white rounded-3xl shadow-xl overflow-hidden group cursor-pointer"
      onClick={() => onCopy(coupon.code)}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content Container */}
      <div className="relative bg-white m-[2px] rounded-3xl overflow-hidden">
        {/* Discount Badge */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white p-8 text-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="inline-block mb-3"
            >
              {isPercentage ? (
                <Percent className="w-12 h-12" />
              ) : (
                <DollarSign className="w-12 h-12" />
              )}
            </motion.div>

            <div className="text-6xl font-black mb-2 tracking-tight">
              {discountDisplay}
            </div>
            <div className="text-xl font-semibold">OFF</div>

            {coupon.minOrderAmount > 0 && (
              <div className="mt-3 inline-block px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                <p className="text-sm font-medium">
                  Min. ${coupon.minOrderAmount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4">
          {/* Code Display */}
          <div className="relative">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-5 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-2xl tracking-wider text-gray-800">
                  {coupon.code}
                </span>
                <motion.div
                  animate={isCopied ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {isCopied ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <Copy className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  )}
                </motion.div>
              </div>
              <p className="text-xs text-gray-500 mt-2 font-medium">
                {isCopied ? '✓ Copied to clipboard!' : 'Click card to copy code'}
              </p>
            </div>
          </div>

          {/* Info Tags */}
          <div className="flex flex-wrap gap-2">
            {/* Expiry */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
              isUrgent 
                ? 'bg-orange-100 text-orange-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-semibold">
                {isUrgent ? `${daysUntilExpiry} days left!` : formatExpiry(coupon.expiryDate)}
              </span>
            </div>

            {/* Stock */}
            {isLowStock && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-red-100 text-red-700">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">
                  Only {remainingCoupons} left!
                </span>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                {coupon.usedCount} / {coupon.usageLimit} used
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` 
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
    </motion.div>
  );
}

function formatExpiry(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}