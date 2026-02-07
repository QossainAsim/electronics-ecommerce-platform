// *********************
// Role of the component: products section intended to be on the home page
// Name of the component: ProductsSection.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <ProductsSection slug={slug} />
// Input parameters: no input parameters
// Output: products grid with modern design
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ProductsSection = async () => {
  let products = [];
  
  try {
    // sending API request for getting all products
    const data = await apiClient.get("/api/products");
    
    if (!data.ok) {
      console.error('Failed to fetch products:', data.statusText);
      products = [];
    } else {
      const result = await data.json();
      // Ensure products is an array
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    products = [];
  }

  // Limit to first 8 products for featured section
  const featuredProducts = products.slice(0, 8);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              TRENDING NOW
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-neutral-900">
              Featured Products
            </h2>
            <p className="text-lg text-neutral-600 mt-2">
              Discover our handpicked selection of top-rated electronics
            </p>
          </div>
          
          {/* View All Button - Desktop */}
          <Link
            href="/shop"
            className="hidden lg:inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map((product: any) => (
                <ProductItem key={product.id} product={product} color="white" />
              ))}
            </div>

            {/* View All Button - Mobile */}
            <div className="mt-12 text-center lg:hidden">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <span>View All Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No Products Available
            </h3>
            <p className="text-neutral-600">
              Check back soon for our latest collection
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;