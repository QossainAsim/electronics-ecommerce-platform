// *********************
// Role of the component: Shop/Category page breadcrumb with category support
// Name of the component: Breadcrumb.tsx
// Developer: Aleksandar Kuzmanovic (Enhanced)
// Version: 3.0
// Component call: <Breadcrumb category="headphones" />
// Input parameters: category (optional string)
// Output: Dynamic breadcrumb for category pages using /category/{categoryName}
// *********************

import Link from "next/link";
import React from "react";
import { FaHouse } from "react-icons/fa6";

interface BreadcrumbProps {
  /**
   * Optional category slug (e.g., "headphones", "mobile", "laptops")
   */
  category?: string;
}

// Helper function to format category text
const formatCategoryText = (text: string): string => {
  if (!text) return "";
  
  // Replace hyphens and underscores with spaces
  const formatted = text.replace(/[-_]/g, " ");
  
  // Capitalize first letter of each word
  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ category }) => {
  return (
    <div className="text-lg breadcrumbs pb-10 py-5 max-sm:text-base">
      <ul>
        {/* Home */}
        <li>
          <Link href="/">
            <FaHouse className="mr-2" />
            Home
          </Link>
        </li>

        {/* Category (if present) */}
        {category ? (
          <li>
            <span className="text-gray-500">
              {formatCategoryText(category)}
            </span>
          </li>
        ) : (
          <li>
            <span className="text-gray-500">All Products</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Breadcrumb;