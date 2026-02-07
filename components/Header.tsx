"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Truck,
  Tag,
  Gift,
} from "lucide-react";
import { useProductStore } from "@/app/_zustand/store";

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

export default function HeaderModern() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // ✅ Get cart count from Zustand store
  const allQuantity = useProductStore((state) => state.allQuantity);

  // Promotional messages for news ticker
  const promoMessages = [
    {
      icon: "🚚",
      text: "Free Shipping on all orders over RS 3000"
    },
    {
      icon: "🔥",
      text: "Exclusive Deals - Save up to 50% on selected items"
    },
    {
      icon: "🎁",
      text: "Special Coupons Available - Get extra discounts"
    }
  ];

  useEffect(() => {
    async function fetchCategories() {
      if (!isSidebarOpen) return;
      
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

    fetchCategories();
  }, [isSidebarOpen]);

  const toggleSection = (categoryId: string) => {
    setActiveSection(activeSection === categoryId ? null : categoryId);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Top Bar - News Ticker Style */}
        <div className="bg-blue-600 text-white py-2 overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translate3d(0, 0, 0); }
              100% { transform: translate3d(-33.333%, 0, 0); }
            }
            
            .ticker-wrapper {
              width: 100%;
              overflow: hidden;
            }
            
            .ticker-content {
              display: flex;
              width: max-content;
              animation: marquee 40s linear infinite;
            }
            
            .ticker-content:hover {
              animation-play-state: paused;
            }
            
            .ticker-item {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              white-space: nowrap;
              padding: 0 2rem;
              font-size: 0.875rem;
            }
          `}} />
          
          <div className="ticker-wrapper">
            <div className="ticker-content">
              {/* First set */}
              {promoMessages.map((message, index) => (
                <div key={`set1-${index}`} className="ticker-item">
                  <span>{message.icon}</span>
                  <span>{message.text}</span>
                  <span className="text-blue-200 mx-2">•</span>
                </div>
              ))}
              
              {/* Second set */}
              {promoMessages.map((message, index) => (
                <div key={`set2-${index}`} className="ticker-item">
                  <span>{message.icon}</span>
                  <span>{message.text}</span>
                  <span className="text-blue-200 mx-2">•</span>
                </div>
              ))}
              
              {/* Third set */}
              {promoMessages.map((message, index) => (
                <div key={`set3-${index}`} className="ticker-item">
                  <span>{message.icon}</span>
                  <span>{message.text}</span>
                  <span className="text-blue-200 mx-2">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold text-gray-800">SINGITRONIC</span>
            </Link>

            {/* Search Bar - DESKTOP ONLY */}
            <div className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <span>{session.user.email}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <Link
                          href="/my-account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/my-orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        
                        {/* ✅ Admin Panel Link - Only visible to admins */}
                        {session?.user?.role === "admin" && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors font-semibold"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            🛡️ Admin Panel
                          </Link>
                        )}
                        
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
              
              <Link href="/wishlist" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Heart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </Link>
              
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {allQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {allQuantity}
                  </span>
                )}
              </Link>
              
              <Link href="/my-account" className="p-2 hover:bg-gray-100 rounded-lg">
                <User className="w-6 h-6 text-gray-700" />
              </Link>
            </div>

            {/* Mobile Icons - Cart and Account with Dropdown */}
            <div className="flex md:hidden items-center gap-3">
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {allQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {allQuantity}
                  </span>
                )}
              </Link>
              
              {/* Account Icon with Dropdown for Mobile */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <User className="w-6 h-6 text-gray-700" />
                </button>

                {/* Mobile Account Dropdown */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      {session?.user ? (
                        <>
                          <div className="px-4 py-2 border-b border-gray-200">
                            <p className="text-xs text-gray-500">Logged in as:</p>
                            <p className="text-sm font-medium text-gray-900 truncate">{session.user.email}</p>
                          </div>
                          <Link
                            href="/my-account"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <Link
                            href="/my-orders"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            My Orders
                          </Link>
                          
                          {/* ✅ Admin Panel Link - Only visible to admins (MOBILE) */}
                          {session?.user?.role === "admin" && (
                            <Link
                              href="/admin"
                              className="block px-4 py-2 text-purple-600 hover:bg-purple-50 transition-colors font-semibold"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              🛡️ Admin Panel
                            </Link>
                          )}
                          
                          <hr className="my-2 border-gray-200" />
                          <button
                            onClick={() => {
                              signOut();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/register"
                            className="block px-4 py-2 text-blue-600 hover:bg-gray-100 transition-colors font-semibold"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-3 md:gap-6 py-3 overflow-x-auto">
              {/* All Categories Button - Opens Sidebar */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
              >
                <Menu className="w-5 h-5" />
                <span>All</span>
              </button>

              {/* Other Nav Links - Hidden on mobile, visible on md+ */}
              <Link href="/deals" className="hidden md:block text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors">
                🔥 Deals
              </Link>
              <Link href="/new-arrivals" className="hidden md:block text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors">
                ✨ New Arrivals
              </Link>
              <Link href="/coupons" className="hidden md:block text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors">
                🎁 Coupons
              </Link>
              <Link href="/customer-service" className="hidden md:block text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors">
                💬 Customer Service
              </Link>
              <Link href="/categories" className="hidden md:block text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors">
                All Categories
              </Link>

              {/* Mobile only - Show only important links */}
              <Link href="/deals" className="md:hidden text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors text-sm">
                🔥 Deals
              </Link>
              <Link href="/coupons" className="md:hidden text-gray-700 hover:text-blue-600 font-medium whitespace-nowrap transition-colors text-sm">
                🎁 Coupons
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Category Sidebar */}
      <>
        {/* Backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-[85vw] max-w-[380px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center justify-between">
            <span className="text-white font-semibold text-lg">Shop by Category</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
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
                            {/* Parent with children - clickable with separate expand button */}
                            <div className="flex items-center border-b border-gray-100">
                              {/* Category Link - Takes user to category page */}
                              <Link
                                href={`/category/${category.slug}`}
                                className="flex-1 px-5 py-3 text-gray-800 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                <span className="font-medium">{category.name}</span>
                              </Link>
                              
                              {/* Expand/Collapse Button */}
                              <button
                                onClick={() => toggleSection(category.id)}
                                className="px-4 py-3 text-gray-400 hover:bg-gray-100 transition-colors"
                              >
                                <ChevronRight
                                  className={`w-5 h-5 transition-transform ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`}
                                />
                              </button>
                            </div>

                            {/* Subcategories */}
                            {isExpanded && (
                              <div className="bg-gray-50 border-b border-gray-100">
                                {category.children?.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/category/${child.slug}`}
                                    className="block pl-10 pr-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsSidebarOpen(false)}
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
                            onClick={() => setIsSidebarOpen(false)}
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
    </>
  );
}