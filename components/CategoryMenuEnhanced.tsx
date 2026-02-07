// *********************
// Role of the component: Clean text-based category navigation with subcategory dropdowns
// Name of the component: CategoryMenuEnhanced.tsx
// Developer: Enhanced by AI
// Version: 5.1 - Fixed API URL
// Component call: <CategoryMenuEnhanced />
// *********************

"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: Category[];
  _count?: {
    products: number;
  };
}

const CategoryMenuEnhanced = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // ✅ FIXED: Use port 3001 (Express backend)
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      
      console.log('📦 Categories loaded:', data.length);
      
      // Get parent categories with their children
      const parentCategories = data.filter((cat: Category) => !cat.parentId);
      
      // Attach children to parents
      const categoriesWithChildren = parentCategories.map((parent: Category) => ({
        ...parent,
        children: data.filter((cat: Category) => cat.parentId === parent.id)
      }));
      
      console.log('✅ Parent categories:', categoriesWithChildren.length);
      setCategories(categoriesWithChildren);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string, hasChildren: boolean) => {
    if (!hasChildren) return;
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Browse our collection
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategory === category.id;

            return (
              <div key={category.id} className="relative">
                {hasChildren ? (
                  // Category with children - shows dropdown
                  <div>
                    <button
                      onClick={() => toggleCategory(category.id, hasChildren)}
                      className="w-full group"
                    >
                      <div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-left">
                            {category.name}
                          </span>
                          <ChevronDown 
                            className={`w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-200 shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                        {category._count && category._count.products > 0 && (
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            {category._count.products} items
                          </p>
                        )}
                      </div>
                    </button>

                    {/* Subcategory Dropdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        >
                          <div className="p-2 space-y-1">
                            {/* ✅ View All Link for parent category */}
                            <Link
                              href={`/category/${category.slug}`}
                              className="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              onClick={() => setExpandedCategory(null)}
                            >
                              View All {category.name}
                            </Link>
                            <hr className="my-1" />
                            {/* Subcategories */}
                            {category.children?.map((child) => (
                              <Link
                                key={child.id}
                                href={`/category/${child.slug}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                                onClick={() => setExpandedCategory(null)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Category without children - direct link
                  <Link
                    href={`/category/${category.slug}`}
                    className="block group"
                  >
                    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200">
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors block">
                        {category.name}
                      </span>
                      {category._count && category._count.products > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {category._count.products} items
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          >
            <span>View All Categories</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryMenuEnhanced;