"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Tag, Percent, DollarSign, Calendar, Hash } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";

const NewCouponPage = () => {
  const router = useRouter();
  const params = useParams();
  const couponId = params?.id as string | undefined;
  const isEdit = !!couponId;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    usageLimit: "100",
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    if (isEdit) {
      fetchCoupon();
    }
  }, [isEdit]);

  const fetchCoupon = async () => {
    try {
      const response = await apiClient.get(`/api/admin/coupons/${couponId}`);
      if (response.ok) {
        const data = await response.json();
        const coupon = data.coupon;
        setFormData({
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue.toString(),
          minOrderAmount: coupon.minOrderAmount.toString(),
          maxDiscount: coupon.maxDiscount?.toString() || "",
          usageLimit: coupon.usageLimit.toString(),
          expiryDate: new Date(coupon.expiryDate).toISOString().split("T")[0],
          isActive: coupon.isActive,
        });
      }
    } catch (error) {
      console.error("Error fetching coupon:", error);
      toast.error("Failed to load coupon");
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        minOrderAmount: parseInt(formData.minOrderAmount),
        maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : null,
        usageLimit: parseInt(formData.usageLimit),
        expiryDate: new Date(formData.expiryDate).toISOString(),
        isActive: formData.isActive,
      };

      const response = isEdit
        ? await apiClient.patch(`/api/admin/coupons/${couponId}`, payload)
        : await apiClient.post("/api/admin/coupons", payload);

      if (response.ok) {
        toast.success(
          isEdit ? "Coupon updated successfully" : "Coupon created successfully"
        );
        router.push("/admin/coupons");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save coupon");
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      toast.error("Failed to save coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Coupons</span>
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">
          {isEdit ? "Edit Coupon" : "Create New Coupon"}
        </h1>
        <p className="text-neutral-600 mt-1">
          {isEdit ? "Update coupon information" : "Add a new discount coupon"}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Coupon Code *
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  placeholder="e.g., SAVE20"
                  maxLength={20}
                />
              </div>
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-semibold hover:bg-neutral-50 transition-colors whitespace-nowrap"
              >
                Generate
              </button>
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Unique code customers will use at checkout
            </p>
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Discount Type *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: "percentage" })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.discountType === "percentage"
                    ? "border-blue-600 bg-blue-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <Percent className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-semibold text-neutral-900">Percentage</p>
                <p className="text-sm text-neutral-600">e.g., 20% off</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, discountType: "fixed" })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.discountType === "fixed"
                    ? "border-blue-600 bg-blue-50"
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                <p className="font-semibold text-neutral-900">Fixed Amount</p>
                <p className="text-sm text-neutral-600">e.g., $10 off</p>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Discount Value *
            </label>
            <div className="relative">
              {formData.discountType === "percentage" ? (
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              ) : (
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              )}
              <input
                type="number"
                min="1"
                max={formData.discountType === "percentage" ? "100" : undefined}
                required
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({ ...formData, discountValue: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={formData.discountType === "percentage" ? "e.g., 20" : "e.g., 10"}
              />
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              {formData.discountType === "percentage"
                ? "Percentage discount (1-100)"
                : "Fixed dollar amount"}
            </p>
          </div>

          {/* Min Order Amount */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Minimum Order Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="number"
                min="0"
                value={formData.minOrderAmount}
                onChange={(e) =>
                  setFormData({ ...formData, minOrderAmount: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Minimum cart value required (0 for no minimum)
            </p>
          </div>

          {/* Max Discount (for percentage only) */}
          {formData.discountType === "percentage" && (
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Maximum Discount Cap (Optional)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="number"
                  min="0"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscount: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="No cap"
                />
              </div>
              <p className="text-sm text-neutral-500 mt-1">
                Maximum dollar amount that can be discounted
              </p>
            </div>
          )}

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Usage Limit *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="number"
                min="1"
                required
                value={formData.usageLimit}
                onChange={(e) =>
                  setFormData({ ...formData, usageLimit: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              Maximum number of times this coupon can be used
            </p>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Expiry Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 border-neutral-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-neutral-900">
                Active Coupon
              </span>
            </label>
            <p className="text-sm text-neutral-500 mt-1 ml-8">
              Coupon will be available to customers when active
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCouponPage;