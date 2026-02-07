// *********************
// Role of the component: Product table component on admin dashboard page
// Name of the component: DashboardProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 2.0
// Component call: <DashboardProductTable />
// Input parameters: no input parameters
// Output: products table with stock management and Rs currency
// *********************

"use client";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomButton from "./CustomButton";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";

const DashboardProductTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Fetch products function
  const fetchProducts = async () => {
    try {
      const res = await apiClient.get("/api/products?mode=admin", {cache: "no-store"});
      const data = await res.json();
      console.log("Fetched products:", data); // Debug log
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  // ✅ Listen for refresh events from edit page
  useEffect(() => {
    const handleRefresh = () => {
      console.log("Refresh event received, fetching products...");
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('refreshProductsList', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshProductsList', handleRefresh);
    };
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold text-center mb-5">All products</h1>
      <div className="flex justify-end mb-5">
        <Link href="/admin/products/new">
          <CustomButton
            buttonType="button"
            customWidth="110px"
            paddingX={10}
            paddingY={5}
            textSize="base"
            text="Add new product"
          />
        </Link>
      </div>

      <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto w-full h-[80vh]">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Product</th>
              <th>Stock Availability</th>
              <th>Total Stock</th>
              <th>Available Stock</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {products &&
              products.map((product) => {
                // ✅ Calculate stock status
                const isOutOfStock = !product?.inStock || product?.totalStock === 0;
                const isLowStock = product?.totalStock > 0 && 
                                  product?.totalStock <= (product?.reorderLevel || 10);
                const availableStock = product?.totalStock || 0;

                return (
                  <tr key={nanoid()}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <Image
                              width={48}
                              height={48}
                              src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
                              alt={sanitize(product?.title) || "Product image"}
                              className="w-auto h-auto"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{sanitize(product?.title)}</div>
                          <div className="text-sm opacity-50">
                            {sanitize(product?.manufacturer)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ✅ Stock Availability Badge */}
                    <td>
                      {isOutOfStock ? (
                        <span className="badge badge-error text-white badge-sm">
                          Out of stock
                        </span>
                      ) : isLowStock ? (
                        <span className="badge badge-warning text-white badge-sm">
                          Low stock
                        </span>
                      ) : (
                        <span className="badge badge-success text-white badge-sm">
                          In stock
                        </span>
                      )}
                    </td>

                    {/* ✅ Total Stock Column */}
                    <td>
                      <span className="font-semibold">{product?.totalStock || 0}</span>
                    </td>

                    {/* ✅ Available Stock Column with Color Coding */}
                    <td>
                      <span className={`font-semibold ${
                        isOutOfStock ? 'text-red-600' : 
                        isLowStock ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {availableStock}
                      </span>
                    </td>

                    {/* ✅ Price in Rs */}
                    <td>
                      <span className="font-semibold">
                        Rs {product?.price.toLocaleString('en-PK')}
                      </span>
                    </td>

                    <th>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        details
                      </Link>
                    </th>
                  </tr>
                );
              })}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Product</th>
              <th>Stock Availability</th>
              <th>Total Stock</th>
              <th>Available Stock</th>
              <th>Price</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DashboardProductTable;