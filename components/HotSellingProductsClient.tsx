// *********************
// Role of the component: Hot selling products UI with animations (Client Component)
// Name of the component: HotSellingProductsClient.tsx
// Developer: Enhanced
// Version: 2.0
// Component call: <HotSellingProductsClient products={products} />
// Input parameters: products array
// Output: Animated hot selling products grid
// *********************

"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Flame, Star } from "lucide-react";
import { sanitize } from "@/lib/sanitize";

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  mainImage?: string;
  rating?: number;
  sales?: string;
  originalPrice?: number;
}

interface HotSellingProductsClientProps {
  products: Product[];
}

const HotSellingProductsClient: React.FC<HotSellingProductsClientProps> = ({ products }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-16"
    >
      <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 rounded-3xl p-8 lg:p-12 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-8 h-8 text-white animate-pulse" />
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Hot Selling Products
              </h2>
            </div>
            <p className="text-white/90 text-lg">
              Complete your order with these trending items
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>View All</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            // Calculate discount percentage if there's an original price
            const discountPercent = product.originalPrice 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 20; // Default discount badge

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
              >
                {/* Image Container */}
                <Link href={`/product/${product.slug}`}>
                  <div className="relative h-48 bg-gradient-to-br from-neutral-50 to-neutral-100 overflow-hidden">
                    <Image
                      fill
                      src={product.mainImage ? `/${product.mainImage}` : "/product_placeholder.jpg"}
                      alt={sanitize(product.title)}
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      -{discountPercent}%
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-neutral-900 text-base mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {sanitize(product.title)}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-neutral-700">
                        {product.rating || 4.5}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      ({product.sales || "New"})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">
                          ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-neutral-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add Button */}
                  <Link href={`/product/${product.slug}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <span>View Product</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <Link
          href="/shop"
          className="sm:hidden mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg"
        >
          <span>View All Products</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
};

export default HotSellingProductsClient;