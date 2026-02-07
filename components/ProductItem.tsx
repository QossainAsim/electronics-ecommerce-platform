// *********************
// Role of the component: Product item component
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic (Updated with Rs currency, Add to Cart, View button)
// Version: 3.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// *********************

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { useProductStore } from "@/app/_zustand/store";

// Deal type
interface Deal {
  id: string;
  productId: string;
  discountPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
}

// Product image type
interface ProductImage {
  imageID?: string;
  image?: {
    imageID: string;
    imageUrl: string;
  };
  imageUrl?: string;
}

// Product type with deal
interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  rating?: number;
  description?: string;
  manufacturer?: string;
  inStock: number;
  mainImage?: string;
  images?: ProductImage[];
  deal?: Deal | null;
  category?: {
    name: string;
  };
}

interface ProductItemProps {
  product: Product;
  color: string;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, color }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ✅ Get addToCart from Zustand store
  const addToCart = useProductStore((state) => state.addToCart);

  // Calculate discount from Deal table
  const hasActiveDeal = product.deal?.isActive === true;
  const discountPercent = hasActiveDeal ? (product.deal?.discountPercent || 0) : 0;
  const discountedPrice = hasActiveDeal 
    ? product.price - (product.price * discountPercent / 100)
    : null;
  const finalPrice = discountedPrice || product.price;

  // Get the product image
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (firstImage.image?.imageUrl) return firstImage.image.imageUrl;
      if (firstImage.imageUrl) return firstImage.imageUrl;
    }
    if (product.mainImage) return product.mainImage;
    return "/placeholder-product.png";
  };

  const imageUrl = getProductImage();

  // ✅ Handle Add to Cart - Properly formatted for Zustand store
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock === 0) return;
    
    setIsAddingToCart(true);
    
    try {
      // ✅ Add to cart with proper structure matching your Zustand store
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: imageUrl,
        amount: 1, // ✅ Using 'amount' instead of 'quantity'
        deal: product.deal ? {
          id: product.deal.id,
          discountPercent: product.deal.discountPercent,
          startDate: product.deal.startDate.toString(),
          endDate: product.deal.endDate.toString(),
        } : null,
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      console.log("✅ Added to cart:", product.title);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-2xl">
      {/* Category Badge */}
      {product.category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            {product.category.name}
          </span>
        </div>
      )}

      {/* Discount Badge */}
      {hasActiveDeal && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            -{discountPercent}% OFF
          </span>
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-16 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Product Image */}
      <Link href={`/product/${product.slug}`}>
        <div className="relative w-full pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.png";
            }}
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5">
        {/* Title */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem] text-[15px]">
            {product.title}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-4 h-4 ${
                    index < Math.floor(product.rating!)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 fill-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {product.rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ₨{finalPrice.toLocaleString()}
          </span>
          {discountedPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₨{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {product.inStock > 0 ? (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-semibold">
                In Stock ({product.inStock} available)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-xs text-red-600 font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.inStock === 0 || isAddingToCart}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
              product.inStock > 0
                ? showSuccess
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : showSuccess ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* View Button */}
          <Link
            href={`/product/${product.slug}`}
            className="px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;