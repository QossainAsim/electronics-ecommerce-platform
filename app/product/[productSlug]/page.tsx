import StockAvailabillity from "@/components/StockAvailabillity";
import UrgencyText from "@/components/UrgencyText";
import ProductTabs from "@/components/ProductTabs";
import SingleProductDynamicFields from "@/components/SingleProductDynamicFields";
import ProductBreadcrumb from "@/components/ProductBreadcrumb"; // ← UPDATED IMPORT
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook, FaSquareXTwitter, FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";
import { Shield, Truck, RotateCcw, Banknote, Star } from "lucide-react";
import ImageGallery from "@/components/ImageGallery";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface Deal {
  id: string;
  productId: string;
  discountPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface ProductType {
  id: string;
  title: string;
  price: number;
  mainImage: string;
  images?: ImageItem[];
  totalStock: number;
  reorderLevel?: number;
  deal?: Deal;
  categoryId?: string;
  category?: Category;
  manufacturer?: string;
  description?: string;
}

interface SingleProductPageProps {
  params: Promise<{ productSlug: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  
  // Fetch product by slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product: ProductType = await data.json();

  if (!product || !product.id) {
    notFound();
  }

  // Fetch product images
  const imagesData = await apiClient.get(
    `/api/images/${product.id}`
  );
  const images = await imagesData.json();

  // Stock status
  const totalStock = product?.totalStock || 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock < (product?.reorderLevel || 10);

  // Calculate discount
  const hasActiveDeal = product.deal?.isActive === true;
  const discountPercent = hasActiveDeal ? (product.deal?.discountPercent || 0) : 0;
  const discountedPrice = hasActiveDeal 
    ? product.price - (product.price * discountPercent / 100)
    : null;

  // All images (main + additional)
  const allImages = [
    { imageID: 'main', productID: product.id, image: product?.mainImage || '/product_placeholder.jpg' },
    ...(Array.isArray(images) ? images : [])
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        {/* ✨ UPDATED BREADCRUMB - Now uses the new component */}
        <ProductBreadcrumb 
          category={product?.category?.name}
          productTitle={sanitize(product?.title)}
        />

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 bg-white rounded-xl p-6 lg:p-10 shadow-sm">
          
          {/* Left Side - Product Image Gallery */}
          <div className="space-y-4">
            
            {/* Stock Badge */}
            {isLowStock && !isOutOfStock && (
              <div className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                Low Stock - Order Soon!
              </div>
            )}

            {/* Image Gallery Component */}
            <ImageGallery 
              images={allImages} 
              productTitle={sanitize(product?.title)}
              hasActiveDeal={hasActiveDeal}
            />

            {/* Trust Icons */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-neutral-700" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-neutral-900">Free Shipping</p>
                  <p className="text-neutral-600 text-xs">On orders over Rs. 5000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-neutral-700" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-neutral-900">Cash on Delivery</p>
                  <p className="text-neutral-600 text-xs">Pay when you receive</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-neutral-700" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-neutral-900">Secure Payment</p>
                  <p className="text-neutral-600 text-xs">100% secure checkout</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-neutral-700" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-neutral-900">7 Day Replacement</p>
                  <p className="text-neutral-600 text-xs">Easy returns policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            
            {/* Product Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 leading-tight mb-3">
                {sanitize(product?.title)}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">(381 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                {hasActiveDeal ? (
                  <>
                    <span className="text-3xl lg:text-4xl font-bold text-neutral-900">
                      Rs. {Math.round(discountedPrice!).toLocaleString()}
                    </span>
                    <span className="text-xl text-neutral-400 line-through">
                      Rs. {product?.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl lg:text-4xl font-bold text-neutral-900">
                    Rs. {product?.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {!isOutOfStock ? (
                <p className="text-green-700 font-semibold text-sm">
                  ✓ {isLowStock ? "Limited Stock Available" : "In Stock"}
                </p>
              ) : (
                <p className="text-red-700 font-semibold text-sm">
                  ✗ Out of Stock
                </p>
              )}
            </div>

            <hr className="border-neutral-200" />

            {/* Dynamic Fields - Quantity, Add to Cart, Buy Now */}
            <SingleProductDynamicFields product={product as any} />

            <hr className="border-neutral-200" />

            {/* Product Meta */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">SKU:</span>
                <span className="font-medium text-neutral-900">{product?.id?.slice(0, 8) || "N/A"}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">Category:</span>
                <span className="font-medium text-neutral-900">{product?.category?.name || "N/A"}</span>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <span className="text-neutral-600">Share:</span>
                <div className="flex items-center gap-2 text-xl">
                  <button 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <FaSquareFacebook />
                  </button>
                  <button 
                    className="text-neutral-900 hover:text-neutral-700 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <FaSquareXTwitter />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-700 transition-colors"
                    aria-label="Share on Pinterest"
                  >
                    <FaSquarePinterest />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs - Description & Reviews */}
        <div className="mt-10">
          <ProductTabs product={product as any} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;