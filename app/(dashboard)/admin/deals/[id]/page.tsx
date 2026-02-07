"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Percent, Calendar, Search } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  mainImage: string;
  price: number;
}

const NewDealPage = () => {
  const router = useRouter();
  const params = useParams();
  const dealId = params?.id as string | undefined;
  const isEdit = !!dealId;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductList, setShowProductList] = useState(false);

  const [formData, setFormData] = useState({
    productId: "",
    productTitle: "",
    discountPercent: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchProducts();
    if (isEdit) {
      fetchDeal();
    }
  }, [isEdit]);

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchDeal = async () => {
    try {
      const response = await apiClient.get(`/api/admin/deals/${dealId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          productId: data.deal.productId,
          productTitle: data.deal.product.title,
          discountPercent: data.deal.discountPercent.toString(),
          endDate: new Date(data.deal.endDate).toISOString().split("T")[0],
          isActive: data.deal.isActive,
        });
      }
    } catch (error) {
      console.error("Error fetching deal:", error);
      toast.error("Failed to load deal");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        productId: formData.productId,
        discountPercent: parseInt(formData.discountPercent),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
      };

      const response = isEdit
        ? await apiClient.patch(`/api/admin/deals/${dealId}`, payload)
        : await apiClient.post("/api/admin/deals", payload);

      if (response.ok) {
        toast.success(isEdit ? "Deal updated successfully" : "Deal created successfully");
        router.push("/admin/deals");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to save deal");
      }
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product: Product) => {
    setFormData({
      ...formData,
      productId: product.id,
      productTitle: product.title,
    });
    setShowProductList(false);
    setSearchQuery("");
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Deals</span>
        </button>
        <h1 className="text-3xl font-bold text-neutral-900">
          {isEdit ? "Edit Deal" : "Create New Deal"}
        </h1>
        <p className="text-neutral-600 mt-1">
          {isEdit ? "Update deal information" : "Add a new promotional deal"}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Select Product *
            </label>
            <div className="relative">
              <div
                onClick={() => setShowProductList(!showProductList)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                {formData.productTitle || "Click to select a product"}
              </div>

              {showProductList && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="flex items-center gap-3 p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                      >
                        <div className="relative w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              product.mainImage
                                ? `/${product.mainImage}`
                                : "/product_placeholder.jpg"
                            }
                            fill
                            alt={product.title}
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">{product.title}</p>
                          <p className="text-sm text-neutral-600">${product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              Discount Percentage *
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.discountPercent}
                onChange={(e) =>
                  setFormData({ ...formData, discountPercent: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 20"
              />
            </div>
            <p className="text-sm text-neutral-500 mt-1">Enter discount from 1-100%</p>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              End Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                Active Deal
              </span>
            </label>
            <p className="text-sm text-neutral-500 mt-1 ml-8">
              Deal will be visible to customers when active
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
              disabled={loading || !formData.productId}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : isEdit ? "Update Deal" : "Create Deal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDealPage;