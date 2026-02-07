'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Flame, TrendingDown, Tag } from 'lucide-react';

interface Deal {
  id: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  originalPrice: number;
  discountedPrice: number;
  savings: number;
}

interface Product {
  id: string;
  slug: string;
  title: string;
  mainImage: string | null;
  price: number;
  rating: number;
  description: string;
  inStock: number;
  category: {
    name: string;
  };
  images: Array<{
    imageID: string;
    image: string;
  }>;
  deal: Deal;
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/products/deals?limit=20');
      const data = await response.json();
      setProducts(data.products || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-12 h-12 animate-pulse" />
            <h1 className="text-5xl font-bold">Hot Deals! 🔥</h1>
          </div>
          <p className="text-xl text-center opacity-90 mb-6">
            Limited time offers - Save big on your favorite products!
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              <span>Up to 70% OFF</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Limited Time Only</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              <span>Best Prices Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">No Active Deals Right Now</h2>
            <p className="text-gray-600 mb-6">
              Check back soon for amazing discounts!
            </p>
            <Link
              href="/shop"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-red-600">{pagination.total}</p>
                  <p className="text-gray-600">Active Deals</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">
                    {products.length > 0
                      ? Math.max(...products.map((p) => p.deal.discountPercent))
                      : 0}
                    %
                  </p>
                  <p className="text-gray-600">Max Discount</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    $
                    {products.length > 0
                      ? Math.max(...products.map((p) => p.deal.savings))
                      : 0}
                  </p>
                  <p className="text-gray-600">Max Savings</p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <DealCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Deal Card Component with Countdown Timer
function DealCard({ product }: { product: Product }) {
  const [timeLeft, setTimeLeft] = useState('');
  
  // ✅ FIX: Add leading slash to image paths
  const getImagePath = (imagePath: string | null | undefined): string => {
    if (!imagePath) return '/placeholder.png';
    
    // If path already starts with http or /, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Add leading slash
    return `/${imagePath}`;
  };

  const mainImage = getImagePath(product.mainImage || product.images?.[0]?.image);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(product.deal.endDate).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('EXPIRED');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [product.deal.endDate]);

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
        {/* Discount Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
            -{product.deal.discountPercent}%
          </div>
        </div>

        {/* Hot Deal Badge - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Flame className="w-3 h-3" />
            HOT
          </div>
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.png';
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase mb-1">{product.category?.name}</p>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 min-h-[3rem]">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < product.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">({product.rating})</span>
          </div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-red-600">
                ${product.deal.discountedPrice}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${product.deal.originalPrice}
              </span>
            </div>
            <p className="text-sm text-green-600 font-medium">
              Save ${product.deal.savings}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">Ends in:</span>
              </div>
              <span className="text-sm font-bold text-red-600 tabular-nums">
                {timeLeft || 'Loading...'}
              </span>
            </div>
          </div>

          {/* Stock Status */}
          {product.inStock > 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-600 font-medium">✓ In Stock</span>
              {product.inStock < 10 && (
                <span className="text-xs text-orange-600 font-medium">
                  Only {product.inStock} left!
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-red-600 font-medium">✗ Out of Stock</span>
          )}
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-lg transition-colors pointer-events-none" />
      </div>
    </Link>
  );
}