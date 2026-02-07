// *********************
// Role of the component: Product page breadcrumb component
// Name of the component: ProductBreadcrumb.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced)
// Version: 3.0
// Component call: <ProductBreadcrumb category={product?.category?.name} productTitle={product?.title} />
// Input parameters: category (string | undefined), productTitle (string)
// Output: Dynamic breadcrumb with proper category linking to /category/{categoryName}
// *********************

import Link from "next/link";
import React from "react";

interface ProductBreadcrumbProps {
  /**
   * Product category name (e.g., "Mobile", "Laptops", "Headphones")
   */
  category?: string;
  
  /**
   * Product title to display
   */
  productTitle: string;
  
  /**
   * Optional custom category URL
   * Default: /category/{category-lowercase}
   */
  categoryHref?: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ 
  category, 
  productTitle,
  categoryHref 
}) => {
  // Sanitize and format category for URL
  const sanitizeCategory = (cat: string): string => {
    // Remove file extensions and special characters
    return cat
      .replace(/\.(webp|jpg|jpeg|png|gif)$/i, '') // Remove image extensions
      .replace(/^\d+_/, '') // Remove timestamp prefixes like "1770273848260_"
      .replace(/[^a-zA-Z0-9-\s]/g, '') // Remove special characters
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  // Check if category is valid (not an image filename)
  const isValidCategory = category && 
                          !category.includes('.webp') && 
                          !category.includes('.jpg') && 
                          !category.includes('.png') &&
                          !/^\d+_/.test(category); // Not a timestamp-prefixed filename

  // Generate category link using /category/{categoryName} route
  const categoryLink = categoryHref || 
                      (isValidCategory ? `/category/${sanitizeCategory(category)}` : '/category/all');
  const categoryLabel = isValidCategory ? category : "All Products";

  return (
    <nav className="text-sm text-neutral-500 mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {/* Home */}
        <li>
          <Link 
            href="/" 
            className="hover:text-neutral-900 transition-colors"
          >
            Home
          </Link>
        </li>
        
        <li>&gt;</li>
        
        {/* Category */}
        {isValidCategory ? (
          <>
            <li>
              <Link 
                href={categoryLink}
                className="hover:text-neutral-900 transition-colors capitalize"
              >
                {categoryLabel}
              </Link>
            </li>
            <li>&gt;</li>
          </>
        ) : null}
        
        {/* Product Title (current page - not clickable) */}
        <li className="text-neutral-900 font-medium truncate max-w-xs">
          {productTitle}
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumb;