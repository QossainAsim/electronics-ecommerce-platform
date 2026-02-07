"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  _count?: {
    products: number;
  };
}

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories', {
          cache: 'no-store'
        });
        
        if (!res.ok) {
          setCategories([]);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          const parentCategories = data.filter((cat: any) => !cat.parentId);
          
          // Attach children to parents
          const categoriesWithChildren = parentCategories.map((parent: any) => ({
            ...parent,
            children: data.filter((cat: any) => cat.parentId === parent.id)
          }));
          
          setCategories(categoriesWithChildren);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-600 mt-2">Browse our complete collection</p>
        </div>
      </div>

      {/* Categories List */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {categories.map((category) => {
            const hasChildren = category.children && category.children.length > 0;
            const isExpanded = expandedCategory === category.id;

            return (
              <div
                key={category.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/category/${category.slug}`}
                    className="flex-1 p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description}
                          </p>
                        )}
                      </div>
                      {category._count && category._count.products > 0 && (
                        <span className="text-sm text-gray-500 ml-4">
                          {category._count.products} products
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Expand Button (only if has children) */}
                  {hasChildren && (
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="px-5 py-5 hover:bg-gray-50 transition-colors border-l border-gray-200"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Subcategories */}
                {hasChildren && isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {category.children.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={`/category/${subcategory.slug}`}
                          className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-sm font-medium border border-gray-200"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
}