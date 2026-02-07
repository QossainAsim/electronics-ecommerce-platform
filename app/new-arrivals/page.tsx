import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

async function getNewArrivals() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/new-arrivals?limit=20`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch new arrivals');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return { products: [], pagination: { total: 0 } };
  }
}

export default async function NewArrivalsPage() {
  const { products, pagination } = await getNewArrivals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">✨ New Arrivals</h1>
          <p className="text-lg opacity-90">
            Check out our latest products - Fresh stock just arrived!
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-600">No new arrivals yet</p>
            <Link 
              href="/shop" 
              className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} of {pagination.total} new products
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
  // ✅ FIX: Add leading slash to image paths if missing
  const rawImage = product.mainImage || product.images?.[0]?.image || '/placeholder.png';
  const mainImage = rawImage?.startsWith('/') || rawImage?.startsWith('http') 
    ? rawImage 
    : `/${rawImage}`;
  
  // ✅ FIX: Calculate discount from Deal table
  const hasActiveDeal = product.deal && product.deal.isActive;
  const discountPercent = hasActiveDeal ? product.deal.discountPercent : 0;
  const discountedPrice = hasActiveDeal 
    ? product.price - (product.price * discountPercent / 100)
    : null;

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={mainImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* NEW Badge */}
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            NEW
          </div>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              -{discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase mb-1">
            {product.category?.name}
          </p>

          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < product.rating ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.rating})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            {discountedPrice ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ${Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            {product.inStock > 0 ? (
              <span className="text-xs text-green-600 font-medium">
                ✓ In Stock ({product.inStock} available)
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                ✗ Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}