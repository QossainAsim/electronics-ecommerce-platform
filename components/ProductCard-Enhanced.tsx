// *********************
// Role: Amazon/Walmart-style Product Card
// Version: 2.0 - Enterprise Grade
// Features: Hover effects, discount badges, ratings, quick actions
// *********************

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    mainImage: string;
    slug: string;
    inStock: number;
    totalStock?: number;  // ✅ Added totalStock
    discount?: number;
    badge?: string;
  };
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
}

const ProductCardEnhanced: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onAddToWishlist 
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  // ✅ Use totalStock if available, fallback to inStock
  const availableStock = product.totalStock !== undefined ? product.totalStock : product.inStock;
  const isOutOfStock = availableStock <= 0;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-200 transition-all duration-300"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={imageError ? "/product_placeholder.jpg" : (product.mainImage.startsWith('/') ? product.mainImage : `/${product.mainImage}`)}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                -{discountPercentage}%
              </span>
            )}
            {product.badge && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-bold">
                {product.badge}
              </span>
            )}
            {/* ✅ Check totalStock instead of inStock */}
            {isOutOfStock && (
              <span className="bg-gray-800 text-white px-2 py-1 rounded-md text-xs font-bold">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Actions - Show on Hover */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlistClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
              }`}
            >
              <FaHeart className="text-lg" />
            </button>
            <Link
              href={`/product/${product.slug}`}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-700 hover:bg-blue-600 hover:text-white transition-all"
            >
              <FaEye className="text-lg" />
            </Link>
          </div>

          {/* Stock Status Bar - ✅ Use availableStock */}
          {!isOutOfStock && availableStock < 10 && (
            <div className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-center py-1 text-xs font-semibold">
              Only {availableStock} left in stock!
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-gray-800 font-medium text-sm line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-xs ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews || 0})
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xl font-bold text-blue-600">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Delivery Info */}
          <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            <span className="font-medium">Free Delivery</span>
          </div>
        </div>

        {/* Add to Cart Button - Show on Hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-3 flex items-center justify-center gap-2 font-semibold transition-colors ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <FaShoppingCart />
            <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCardEnhanced;