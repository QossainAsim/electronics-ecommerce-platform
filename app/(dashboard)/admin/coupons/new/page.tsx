"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gift, Calendar, DollarSign, Percent, Hash } from 'lucide-react';

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscount: '',
    usageLimit: '100',
    expiryDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          discountValue: parseFloat(formData.discountValue),
          minOrderAmount: parseFloat(formData.minOrderAmount),
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: parseInt(formData.usageLimit),
          isActive: true,
        }),
      });

      if (response.ok) {
        alert('Coupon created successfully!');
        router.push('/admin/coupons');
      } else {
        alert('Failed to create coupon');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Coupon</h1>
          <p className="text-gray-600 mt-2">Set up a discount coupon for your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Gift className="w-4 h-4 inline mr-2" />
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., NEWYEAR26"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase font-mono"
              pattern="[A-Z0-9]+"
              title="Only uppercase letters and numbers allowed"
            />
            <p className="text-sm text-gray-500 mt-1">Use uppercase letters and numbers only</p>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'percentage' })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                  formData.discountType === 'percentage'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Percent className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Percentage</div>
                  <div className="text-xs text-gray-500">e.g., 20% OFF</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: 'fixed' })}
                className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                  formData.discountType === 'fixed'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Fixed Amount</div>
                  <div className="text-xs text-gray-500">e.g., $50 OFF</div>
                </div>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Value *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === 'percentage' ? '20' : '50'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-3 text-gray-500">
                {formData.discountType === 'percentage' ? '%' : '$'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {formData.discountType === 'percentage' 
                ? 'Enter percentage (e.g., 20 for 20% off)'
                : 'Enter dollar amount (e.g., 50 for $50 off)'
              }
            </p>
          </div>

          {/* Min Order Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-2" />
              Minimum Order Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.minOrderAmount}
              onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Set to 0 for no minimum</p>
          </div>

          {/* Max Discount (for percentage type) */}
          {formData.discountType === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount Cap ($) - Optional
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="e.g., 100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Maximum discount amount for percentage discounts</p>
            </div>
          )}

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 inline mr-2" />
              Usage Limit
            </label>
            <input
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              placeholder="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Total number of times this coupon can be used</p>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Expiry Date *
            </label>
            <input
              type="date"
              required
              value={formData.expiryDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Coupon will be invalid after this date</p>
          </div>

          {/* Preview */}
          {formData.code && formData.discountValue && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">Coupon Preview</h3>
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold font-mono">{formData.code || 'COUPONCODE'}</p>
                    <p className="text-sm opacity-90 mt-1">
                      {formData.discountType === 'percentage' 
                        ? `${formData.discountValue}% OFF`
                        : `$${formData.discountValue} OFF`
                      }
                    </p>
                  </div>
                  <Gift className="w-12 h-12 opacity-75" />
                </div>
                {parseFloat(formData.minOrderAmount) > 0 && (
                  <p className="text-xs mt-3 opacity-75">
                    Min. order: ${formData.minOrderAmount}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/coupons')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}