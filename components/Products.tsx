// *********************
// Role of the component: Showing products on the shop page with applied filter and sort
// Name of the component: Products.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.5 - FINAL FIX - Matches Filters component
// Component call: <Products params={params} searchParams={searchParams} />
// Input parameters: { params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }
// Output: products grid
// *********************

import React from "react";
import ProductItem from "./ProductItem";
import apiClient from "@/lib/api";

const Products = async ({ params, searchParams }: { params: { slug?: string[] }, searchParams: { [key: string]: string | string[] | undefined } }) => {
  const inStockChecked = searchParams?.inStock === "true";
  const outOfStockChecked = searchParams?.outOfStock === "true";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  let products = [];

  try {
    // ✅ CORRECT LOGIC: When both checkboxes are checked, show ALL products (no stock filter)
    let stockFilter = "";
    
    // If BOTH are checked → Show all products (default state)
    if (inStockChecked && outOfStockChecked) {
      stockFilter = ""; // No filter, show everything
    }
    // If ONLY "In Stock" is checked → Show products with inStock > 0
    else if (inStockChecked && !outOfStockChecked) {
      stockFilter = "filters[inStock][$gt]=0";
    }
    // If ONLY "Out of Stock" is checked → Show products with inStock = 0
    else if (!inStockChecked && outOfStockChecked) {
      stockFilter = "filters[inStock][$equals]=0";
    }
    // If NEITHER is checked → Show nothing (edge case)
    else {
      stockFilter = "filters[inStock][$lt]=-1"; // Impossible condition = no results
    }

    // Build URL
    const baseFilters = `filters[price][$lte]=${searchParams?.price || 3000}&filters[rating][$gte]=${Number(searchParams?.rating) || 0}`;
    const categoryFilter = params?.slug?.length! > 0 ? `filters[category][$equals]=${params?.slug}` : "";
    const sortParam = `sort=${searchParams?.sort || 'defaultSort'}`;
    
    const filters = [baseFilters, stockFilter, categoryFilter, sortParam, `page=${page}`]
      .filter(f => f !== "")
      .join("&");

    const url = `/api/products?${filters}`;
    
    console.log('🔍 Fetching products from:', url);
    console.log('📊 Stock filters:', { inStockChecked, outOfStockChecked, stockFilter });

    const data = await apiClient.get(url);

    if (!data.ok) {
      console.error('❌ Failed to fetch products:', data.status, data.statusText);
      products = [];
    } else {
      const result = await data.json();
      console.log('✅ Products loaded:', Array.isArray(result) ? result.length : 'not an array');
      products = Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    products = [];
  }

  return (
    <div className="grid grid-cols-3 justify-items-center gap-x-2 gap-y-5 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1">
      {products.length > 0 ? (
        products.map((product: any) => (
          <ProductItem key={product.id} product={product} color="black" />
        ))
      ) : (
        <h3 className="text-3xl mt-5 text-center w-full col-span-full max-[1000px]:text-2xl max-[500px]:text-lg">
          No products found for specified query
        </h3>
      )}
    </div>
  );
};

export default Products;