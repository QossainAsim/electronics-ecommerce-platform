"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";

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

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories', {
          cache: 'no-store'
        });

        if (!response.ok) {
          setCategories([]);
          return;
        }

        const data = await response.json();

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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const toggleSection = (categoryId: string) => {
    setActiveSection(activeSection === categoryId ? null : categoryId);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[380px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
          <span className="text-white font-semibold text-lg">Shop by Category</span>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          ) : (
            <>
              {/* Categories Only */}
              <div>
                {categories.map((category) => {
                  const hasChildren = category.children && category.children.length > 0;
                  const isExpanded = activeSection === category.id;

                  return (
                    <div key={category.id}>
                      {hasChildren ? (
                        <>
                          {/* Parent with children - expandable */}
                          <button
                            onClick={() => toggleSection(category.id)}
                            className="w-full flex items-center justify-between px-5 py-3 text-gray-800 hover:bg-gray-100 transition-colors text-left border-b border-gray-100"
                          >
                            <span className="font-medium">{category.name}</span>
                            <ChevronRight
                              className={`w-5 h-5 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-90' : ''
                              }`}
                            />
                          </button>

                          {/* Subcategories */}
                          {isExpanded && (
                            <div className="bg-gray-50 border-b border-gray-100">
                              {category.children?.map((child) => (
                                <Link
                                  key={child.id}
                                  href={`/category/${child.slug}`}
                                  className="block pl-10 pr-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                  onClick={onClose}
                                >
                                  {child.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        // Parent without children - direct link
                        <Link
                          href={`/category/${category.slug}`}
                          className="block px-5 py-3 text-gray-800 hover:bg-gray-100 transition-colors border-b border-gray-100"
                          onClick={onClose}
                        >
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}