'use client';

import React, { useState } from 'react';
import { Tag, Gift, X, Check, AlertCircle } from 'lucide-react';

interface DiscountInputProps {
  orderAmount: number;
  onDiscountApplied: (discount: {
    type: 'coupon' | 'giftcard';
    code: string;
    amount: number;
  }) => void;
  onDiscountRemoved: () => void;
}

export default function DiscountInput({ 
  orderAmount, 
  onDiscountApplied, 
  onDiscountRemoved 
}: DiscountInputProps) {
  const [activeTab, setActiveTab] = useState<'coupon' | 'giftcard'>('coupon');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: 'coupon' | 'giftcard';
    code: string;
    amount: number;
  } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = activeTab === 'coupon' 
        ? '/api/coupons/validate' 
        : '/api/gift-cards/validate';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          orderAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      let discountAmount = 0;

      if (activeTab === 'coupon') {
        discountAmount = data.coupon.discountAmount;
      } else {
        // For gift cards, use minimum of balance or order amount
        discountAmount = Math.min(data.giftCard.balance, orderAmount);
      }

      const discount = {
        type: activeTab,
        code: code.toUpperCase(),
        amount: discountAmount,
      };

      setAppliedDiscount(discount);
      onDiscountApplied(discount);
      setCode('');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setAppliedDiscount(null);
    onDiscountRemoved();
    setError('');
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      {/* Applied Discount */}
      {appliedDiscount && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              {appliedDiscount.type === 'coupon' ? (
                <Tag className="w-5 h-5 text-green-600" />
              ) : (
                <Gift className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <p className="font-semibold text-green-900">
                {appliedDiscount.type === 'coupon' ? 'Coupon' : 'Gift Card'} Applied!
              </p>
              <p className="text-sm text-green-700">
                Code: {appliedDiscount.code} • Discount: ${appliedDiscount.amount}
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-600 hover:text-green-800 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Input Section (only show if no discount applied) */}
      {!appliedDiscount && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('coupon')}
              className={`flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'coupon'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Tag className="w-4 h-4" />
              Coupon Code
            </button>
            <button
              onClick={() => setActiveTab('giftcard')}
              className={`flex-1 py-3 px-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'giftcard'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Gift className="w-4 h-4" />
              Gift Card
            </button>
          </div>

          {/* Input Field */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={
                  activeTab === 'coupon' 
                    ? 'Enter coupon code' 
                    : 'Enter gift card code'
                }
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                onKeyPress={(e) => e.key === 'Enter' && handleApply()}
              />
              <button
                onClick={handleApply}
                disabled={loading || !code.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  activeTab === 'coupon'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Apply'
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {/* Helper Text */}
            <p className="text-xs text-gray-500">
              {activeTab === 'coupon' 
                ? 'Enter your coupon code to get a discount on your order' 
                : 'Gift card balance will be applied to your order total'}
            </p>
          </div>
        </>
      )}
    </div>
  );
}