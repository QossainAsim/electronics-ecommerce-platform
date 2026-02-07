"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Percent, Package } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  mainImage: string;
}

export default function NewDealPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    productId: '',
    discountPercent: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          discountPercent: parseInt(formData.discountPercent),
        }),
      });

      if (response.ok) {
        alert('Deal created successfully!');
        router.push('/admin/deals');
      } else {
        alert('Failed to create deal');
      }
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const selectedProduct = products.find(p => p.id === formData.productId);
  const discountedPrice = selectedProduct 
    ? selectedProduct.price - (selectedProduct.price * (parseInt(formData.discountPercent) || 0) / 100)
    : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
          <p className="text-gray-600 mt-2">Set up a discount deal for a product</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Select Product *
            </label>
            <select
              required
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a product...</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Percent className="w-4 h-4 inline mr-2" />
              Discount Percentage *
            </label>
            <input
              type="number"
              required
              min="1"
              max="99"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
              placeholder="e.g., 20 for 20% off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">Enter a value between 1 and 99</p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                min={formData.startDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {selectedProduct && formData.discountPercent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="flex items-center gap-4">
                <img 
                  src={selectedProduct.mainImage || '/placeholder.png'} 
                  alt={selectedProduct.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium text-gray-900">{selectedProduct.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-500 line-through">${selectedProduct.price}</span>
                    <span className="text-2xl font-bold text-green-600">${discountedPrice.toFixed(2)}</span>
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                      {formData.discountPercent}% OFF
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    You save: ${(selectedProduct.price - discountedPrice).toFixed(2)}
                  </p>
                </div>
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
              {loading ? 'Creating...' : 'Create Deal'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/deals')}
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