"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "@/app/_zustand/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  Truck,
  Shield,
  ArrowLeft,
  Tag,
  X,
  AlertCircle,
  Gift,
  CheckCircle,
} from "lucide-react";
import { sanitize } from "@/lib/sanitize";
import ProgressSteps from "@/components/ProgressSteps";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */
type HotProduct = {
  id: string;
  title: string;
  price: number;
  mainImage?: string;
};

/* ---------------- CONSTANTS ---------------- */
const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING_COST = 200;

/* ---------------- VALIDATION UTILITIES ---------------- */

/**
 * Validates Pakistani phone numbers
 * Accepts formats:
 * - +92XXXXXXXXXX (13 digits with +92)
 * - 03XXXXXXXXX (11 digits starting with 0)
 * - 3XXXXXXXXX (10 digits without leading 0)
 */
const validatePakistaniPhone = (phone: string): { isValid: boolean; message: string } => {
  // Remove spaces, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Pattern 1: +92XXXXXXXXXX (international format)
  const intlPattern = /^\+92[0-9]{10}$/;
  
  // Pattern 2: 03XXXXXXXXX (local format with leading 0)
  const localPattern = /^0[0-9]{10}$/;
  
  // Pattern 3: 3XXXXXXXXX (without leading 0)
  const shortPattern = /^[0-9]{10}$/;
  
  if (intlPattern.test(cleaned)) {
    return { isValid: true, message: 'Valid Pakistani number' };
  }
  
  if (localPattern.test(cleaned)) {
    return { isValid: true, message: 'Valid Pakistani number' };
  }
  
  if (shortPattern.test(cleaned)) {
    return { isValid: true, message: 'Valid Pakistani number' };
  }
  
  return { 
    isValid: false, 
    message: 'Please enter a valid Pakistani phone number (e.g., +923001234567 or 03001234567)' 
  };
};

/**
 * Validates email format using regex
 */
const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if email exists using a verification API
 * Note: You'll need to implement the backend API endpoint or use a third-party service
 */
const checkEmailExists = async (email: string): Promise<{ exists: boolean; message: string }> => {
  try {
    // Option 1: Use your own backend API
    const response = await fetch('/api/validate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    return data;
    
    // Option 2: Use a third-party service like AbstractAPI, Hunter.io, or EmailListVerify
    // Uncomment and configure this if you prefer:
    /*
    const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=YOUR_API_KEY&email=${email}`);
    const data = await response.json();
    
    return {
      exists: data.deliverability === 'DELIVERABLE',
      message: data.deliverability === 'DELIVERABLE' ? 'Email is valid' : 'Email may not exist'
    };
    */
  } catch (error) {
    console.error('Email validation error:', error);
    // If validation fails, allow the user to proceed (don't block checkout)
    return { exists: true, message: 'Could not verify email' };
  }
};

/* ---------------- COMPONENT ---------------- */
const CheckoutPage = () => {
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  const [hotProducts, setHotProducts] = useState<HotProduct[]>([]);
  const [loadingHot, setLoadingHot] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Validation states
  const [phoneError, setPhoneError] = useState('');
  const [phoneValid, setPhoneValid] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);

  // Discount states
  const [couponCode, setCouponCode] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
  } | null>(null);

  // FREE SHIPPING LOGIC
  const isFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  
  const discountAmount = appliedDiscount?.amount || 0;
  const orderTotal = total > 0 ? total + shippingCost - discountAmount : 0;

  /* -------- PHONE VALIDATION -------- */
  const handlePhoneChange = (value: string) => {
    setPhone(value);
    
    if (value.trim() === '') {
      setPhoneError('');
      setPhoneValid(false);
      return;
    }
    
    const validation = validatePakistaniPhone(value);
    setPhoneValid(validation.isValid);
    setPhoneError(validation.isValid ? '' : validation.message);
  };

  /* -------- EMAIL VALIDATION -------- */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    
    if (value.trim() === '') {
      setEmailError('');
      setEmailValid(false);
      return;
    }
    
    // First check format
    if (!validateEmailFormat(value)) {
      setEmailError('Please enter a valid email address');
      setEmailValid(false);
      return;
    }
    
    setEmailError('');
    setEmailValid(false);
  };

  /* -------- EMAIL EXISTENCE CHECK (on blur) -------- */
  const handleEmailBlur = async () => {
    if (email.trim() === '' || !validateEmailFormat(email)) {
      return;
    }
    
    setIsValidatingEmail(true);
    
    try {
      const result = await checkEmailExists(email);
      
      if (result.exists) {
        setEmailValid(true);
        setEmailError('');
      } else {
        setEmailValid(false);
        setEmailError('This email may not exist. Please check and try again.');
      }
    } catch (error) {
      // If validation fails, allow user to proceed
      setEmailValid(true);
      setEmailError('');
    } finally {
      setIsValidatingEmail(false);
    }
  };

  /* -------- FETCH HOT PRODUCTS -------- */
  useEffect(() => {
    const loadHotProducts = async () => {
      try {
        const res = await fetch("/api/products/hot-selling", {
          cache: "no-store",
        });
        const data = await res.json();
        setHotProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Hot products fetch failed", err);
      } finally {
        setLoadingHot(false);
      }
    };

    loadHotProducts();
  }, []);

  /* -------- APPLY COUPON -------- */
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setLoadingCoupon(true);
    setCouponError('');

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          orderAmount: total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid coupon code');
      }

      setAppliedDiscount({
        code: couponCode.toUpperCase(),
        amount: data.coupon.discountAmount,
      });
      
      console.log('🎫 Coupon applied:', {
        code: couponCode.toUpperCase(),
        discountAmount: data.coupon.discountAmount
      });
      
      setCouponCode('');
      toast.success('Coupon applied successfully!');
    } catch (err: any) {
      setCouponError(err.message);
      toast.error(err.message);
    } finally {
      setLoadingCoupon(false);
    }
  };

  /* -------- REMOVE COUPON -------- */
  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponError('');
    toast.success('Coupon removed');
  };

  /* -------- PLACE ORDER -------- */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (products.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Validate phone before submission
    if (!phoneValid) {
      toast.error('Please enter a valid Pakistani phone number');
      return;
    }

    // Validate email before submission
    if (!emailValid && !isValidatingEmail) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        firstName,
        lastName,
        email,
        phone,
        company: company || '',
        address,
        apartment: apartment || '',
        city,
        country: state,
        postalCode,
        products: products.map(p => ({
          productId: p.id,
          quantity: p.amount,
          price: getProductPrice(p)
        })),
        totalPrice: orderTotal,
        shippingCost: shippingCost,
        couponCode: appliedDiscount?.code || null,
        discountAmount: appliedDiscount?.amount || 0
      };

      console.log('📦 Sending order with data:', JSON.stringify(orderData, null, 2));

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to create order');
      }

      console.log('✅ Order created successfully:', result);

      clearCart();
      toast.success('Order placed successfully!');
      router.push("/order-complete");
      
    } catch (error: any) {
      console.error('❌ Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get discounted price
  const getProductPrice = (product: any) => {
    if (product.deal && product.deal.discountPercent > 0) {
      return Math.round(product.price * (1 - product.deal.discountPercent / 100));
    }
    return product.price;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <ProgressSteps currentStep={2} />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
        {/* BACK */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        {/* FREE SHIPPING BANNER */}
        {!isFreeShipping && amountToFreeShipping > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <div>
                <p className="font-bold text-sm">
                  Add Rs. {amountToFreeShipping.toLocaleString()} more for FREE shipping! 🎉
                </p>
                <p className="text-xs opacity-90">
                  Orders over Rs. {FREE_SHIPPING_THRESHOLD.toLocaleString()} ship for free
                </p>
              </div>
            </div>
            <Gift className="w-8 h-8 opacity-80" />
          </motion.div>
        )}

        {/* FREE SHIPPING UNLOCKED */}
        {isFreeShipping && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-4 mb-6 flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6" />
              <div>
                <p className="font-bold text-sm">
                  🎉 Congratulations! You've unlocked FREE shipping!
                </p>
                <p className="text-xs opacity-90">
                  Your order qualifies for free delivery
                </p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-1 text-sm font-bold">
              FREE
            </div>
          </motion.div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* ================= LEFT: FORM ================= */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6 lg:p-8"
            >
              <h2 className="text-2xl font-bold mb-6">
                Contact Information
              </h2>

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                {/* NAME */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    className="input px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    className="input px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* EMAIL / PHONE WITH VALIDATION */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* EMAIL INPUT */}
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={handleEmailBlur}
                      placeholder="Email Address"
                      className={`input w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        emailError ? 'border-red-500' : emailValid ? 'border-green-500' : 'border-gray-300'
                      }`}
                    />
                    {isValidatingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {emailValid && !isValidatingEmail && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                    {emailError && (
                      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>

                  {/* PHONE INPUT */}
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="Phone Number (e.g., 03001234567)"
                      className={`input w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        phoneError ? 'border-red-500' : phoneValid ? 'border-green-500' : 'border-gray-300'
                      }`}
                    />
                    {phoneValid && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                    {phoneError && (
                      <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{phoneError}</span>
                      </div>
                    )}
                    {phoneValid && !phoneError && (
                      <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Valid Pakistani number</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* COMPANY (optional) */}
                <div>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company (optional)"
                    className="input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* ADDRESS */}
                <div className="border-t pt-6 space-y-4">
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address"
                    className="input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apartment / Suite (optional)"
                    className="input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <input 
                      required 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City" 
                      className="input px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      required 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State/Country" 
                      className="input px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                    <input 
                      required 
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="ZIP Code" 
                      className="input px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>

                {/* TRUST */}
                <div className="flex gap-4 text-sm text-neutral-600 pt-4">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-600" />
                    Secure
                  </span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-blue-600" />
                    {isFreeShipping ? 'Free Delivery' : 'Fast Delivery'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4 text-purple-600" />
                    Encrypted
                  </span>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting || products.length === 0 || !phoneValid || (!emailValid && !isValidatingEmail)}
                  className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Place Order</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* ================= RIGHT: SUMMARY ================= */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <motion.div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {products.map((p) => {
                  const displayPrice = getProductPrice(p);
                  const hasDiscount = p.deal && p.deal.discountPercent > 0;

                  return (
                    <div key={p.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-neutral-50 rounded-lg">
                        <Image
                          fill
                          src={p.image.startsWith('/') ? p.image : `/${p.image}`}
                          alt={sanitize(p.title)}
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {sanitize(p.title)}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-blue-600 font-bold">
                            Rs. {displayPrice.toLocaleString()}
                          </p>
                          {hasDiscount && (
                            <p className="text-gray-400 line-through text-xs">
                              Rs. {p.price.toLocaleString()}
                            </p>
                          )}
                        </div>
                        {hasDiscount && (
                          <span className="inline-block text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded mt-1">
                            Save {p.deal!.discountPercent}%
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Qty: {p.amount}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= DISCOUNT INPUT ================= */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Have a Coupon?
                </h3>

                {/* Applied Discount */}
                {appliedDiscount ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-900 text-sm">
                        Coupon Applied!
                      </p>
                      <p className="text-xs text-green-700">
                        Code: {appliedDiscount.code} • Save Rs. {appliedDiscount.amount.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm uppercase"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={loadingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {loadingCoupon ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>

                    {/* Error Message */}
                    {couponError && (
                      <div className="flex items-center gap-2 text-red-600 text-xs mt-2">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="border-y py-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
                
                {/* SHIPPING WITH FREE BADGE */}
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  {isFreeShipping ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        FREE
                      </span>
                      <span className="line-through text-gray-400 text-xs">
                        Rs. {STANDARD_SHIPPING_COST.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span>Rs. {shippingCost.toLocaleString()}</span>
                  )}
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount</span>
                    <span>-Rs. {appliedDiscount.amount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">
                  Rs. {orderTotal.toLocaleString()}
                </span>
              </div>

              {/* SAVINGS SUMMARY */}
              {(isFreeShipping || appliedDiscount) && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    🎉 You're saving:
                  </p>
                  <div className="space-y-1 text-xs text-green-700">
                    {isFreeShipping && (
                      <p>• Free Shipping: Rs. {STANDARD_SHIPPING_COST.toLocaleString()}</p>
                    )}
                    {appliedDiscount && (
                      <p>• Coupon Discount: Rs. {appliedDiscount.amount.toLocaleString()}</p>
                    )}
                    <p className="font-bold text-sm pt-1">
                      Total Savings: Rs. {(
                        (isFreeShipping ? STANDARD_SHIPPING_COST : 0) + 
                        (appliedDiscount?.amount || 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ================= HOT SELLING ================= */}
        <motion.div className="mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">
              🔥 Hot Selling Products
            </h2>

            {loadingHot ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {hotProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white text-black rounded-2xl p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32 mb-3">
                      <Image
                        fill
                        src={p.mainImage?.startsWith('/') ? p.mainImage : `/${p.mainImage || "product_placeholder.jpg"}`}
                        alt={sanitize(p.title)}
                        className="object-contain"
                      />
                    </div>
                    <p className="font-semibold text-sm line-clamp-2">
                      {sanitize(p.title)}
                    </p>
                    <p className="text-blue-600 font-bold">Rs. {p.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;