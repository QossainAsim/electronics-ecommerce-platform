// *********************
// Role of the component: Product tabs with Description, Specifications, and Reviews
// Name of the component: ProductTabs.tsx
// Developer: Redesigned Version
// Version: 3.1 - Fixed Types
// Component call: <ProductTabs product={product} />
// Input parameters: { product: any }
// Output: Beautiful tabs with functional review system
// *********************

"use client";

import React, { useState } from "react";
import { formatCategoryName } from "@/utils/categoryFormating";
import { sanitize, sanitizeHtml } from "@/lib/sanitize";
import { Star, ThumbsUp, Calendar, User } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ProductTabsProps {
  product: any;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userName: "Ahmed Khan",
      rating: 5,
      comment: "Excellent product! Exactly as described. Fast delivery and great quality. Highly recommended!",
      date: "2026-01-15",
      helpful: 12
    },
    {
      id: "2",
      userName: "Fatima Ali",
      rating: 4,
      comment: "Good product overall. The quality is great but delivery took a bit longer than expected. Still satisfied with the purchase.",
      date: "2026-01-10",
      helpful: 8
    },
    {
      id: "3",
      userName: "Hassan Ahmed",
      rating: 5,
      comment: "Outstanding! This is exactly what I needed. The build quality is premium and works perfectly. Worth every rupee!",
      date: "2026-01-05",
      helpful: 15
    }
  ]);

  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 5,
    comment: ""
  });

  const tabs = [
    { id: 0, label: "Description", icon: "📄" },
    { id: 1, label: "Specifications", icon: "⚙️" },
    { id: 2, label: "Reviews", icon: "⭐", count: reviews.length },
  ];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newReview.userName || !newReview.comment) {
      alert("Please fill in all fields");
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: "", rating: 5, comment: "" });
    alert("Review submitted successfully!");
  };

  const handleHelpful = (reviewId: string) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200">
      
      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`
                relative px-6 lg:px-8 py-4 text-sm lg:text-base font-semibold transition-all duration-200 flex items-center gap-2
                ${
                  currentTab === tab.id
                    ? "text-neutral-900 bg-white border-b-2 border-neutral-900"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }
              `}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-2 py-0.5 bg-neutral-200 text-neutral-700 text-xs rounded-full font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6 lg:p-10">
        
        {/* DESCRIPTION TAB */}
        {currentTab === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Product Description</h2>
              <div
                className="prose prose-neutral prose-lg max-w-none text-neutral-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(product?.description || "No description available."),
                }}
              />
            </div>

            {/* Key Features Section */}
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200 mt-8">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Key Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">Premium quality materials for long-lasting durability</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">Fast and reliable performance you can trust</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">Easy to use with intuitive design</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-neutral-700">Energy efficient and environmentally friendly</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* SPECIFICATIONS TAB */}
        {currentTab === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">Manufacturer</span>
                  <span className="text-base font-medium text-neutral-900">
                    {sanitize(product?.manufacturer) || "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">Category</span>
                  <span className="text-base font-medium text-neutral-900">
                    {product?.category?.name
                      ? sanitize(formatCategoryName(product?.category?.name))
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">SKU</span>
                  <span className="text-base font-medium text-neutral-900">
                    {product?.id?.slice(0, 8) || "N/A"}
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">Availability</span>
                  <span className="text-base font-medium text-green-600">
                    In Stock
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">Payment</span>
                  <span className="text-base font-medium text-neutral-900">
                    Cash on Delivery
                  </span>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-neutral-600">Shipping</span>
                  <span className="text-base font-medium text-green-600">
                    Free Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Package Contents</h3>
              <ul className="space-y-2 text-neutral-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                  <span>1x {sanitize(product?.title)}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                  <span>User Manual & Warranty Card</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></span>
                  <span>Accessories (if applicable)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {currentTab === 2 && (
          <div className="space-y-8">
            
            {/* Rating Summary */}
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Overall Rating */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="text-5xl font-bold text-neutral-900 mb-2">{averageRating}</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${
                          i < Math.round(parseFloat(averageRating)) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600">{reviews.length} reviews</p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = reviews.filter(r => r.rating === rating).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-neutral-700 w-8">{rating}★</span>
                        <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-neutral-600 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Write a Review */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Write a Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Your Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className="focus:outline-none"
                      >
                        <Star 
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            rating <= newReview.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-300 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    required
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-neutral-900 text-white font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Customer Reviews */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-neutral-900">Customer Reviews</h3>
              
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div 
                      key={review.id} 
                      className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-neutral-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900">{review.userName}</p>
                            <div className="flex items-center gap-2 text-xs text-neutral-500">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(review.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-neutral-700 leading-relaxed mb-4">{review.comment}</p>
                      
                      <button
                        onClick={() => handleHelpful(review.id)}
                        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;