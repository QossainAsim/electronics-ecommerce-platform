// *********************
// Role of the component: Hot selling products carousel section (Server Component)
// Name of the component: HotSellingProducts.tsx
// *********************

import React from "react";
import HotSellingProductsClient from './HotSellingProductsClient';

const HotSellingProducts = async () => {
  let hotProducts: any[] = [];
  
  try {
    // Use the hot-selling endpoint that actually exists
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/hot-selling`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (response.ok) {
      hotProducts = await response.json();
    } else {
      console.error('Hot selling endpoint returned:', response.status);
    }
  } catch (error) {
    console.error('Error fetching hot products:', error);
  }

  // Don't show section if no products
  if (hotProducts.length === 0) {
    return null;
  }

  return <HotSellingProductsClient products={hotProducts} />;
};

export default HotSellingProducts;