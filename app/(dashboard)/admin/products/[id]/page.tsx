"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, use } from "react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import apiClient from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface OtherImages {
  imageID: string;
  productID: string;
  image: string;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  mainImage: string;
  price: number;
  inStock: number;
  totalStock: number;
  reorderLevel: number;
  manufacturer: string;
  description: string;
  categoryId: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const AdminProductEdit = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [otherImages, setOtherImages] = useState<OtherImages[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  const fetchProductData = async () => {
    try {
      const res = await apiClient.get(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      const imagesData = await apiClient.get(`/api/images/${id}`);
      const images = await imagesData.json();
      setOtherImages(images);
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast.error("Failed to load product data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProductData();
  }, [id]);

  // Update product
  const updateProduct = async () => {
    if (!product) return;

    if (
      product.title === "" ||
      product.slug === "" ||
      product.price.toString() === "" ||
      product.manufacturer === "" ||
      product.description === ""
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await apiClient.put(`/api/products/${id}`, product);

      if (response.ok) {
        await response.json();
        toast.success("Product successfully updated");
        
        // Refresh product data
        await fetchProductData();
        
        // Trigger products list refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('refreshProductsList'));
        }
        
        // Navigate back after 1 second
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("An error occurred while updating product");
    }
  };

  // Delete product
  const deleteProduct = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await apiClient.delete(`/api/products/${id}`);
      
      if (response.status === 204) {
        toast.success("Product deleted successfully");
        router.push("/admin/products");
      } else if (response.status === 400) {
        toast.error("Cannot delete product - it may be referenced in orders");
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting product");
    }
  };

  // Upload main image
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    
    setUploading(true);

    try {
      const response = await fetch("/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        await response.json();
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <button
          onClick={() => router.push("/admin/products")}
          className="btn btn-ghost btn-sm"
        >
          ← Back to Products
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Product Name */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Product Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
          />
        </div>

        {/* Product Slug */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Slug (URL)</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={product.slug}
            onChange={(e) => setProduct({ ...product, slug: e.target.value })}
          />
        </div>

        {/* Price */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Price (Rs)</span>
          </label>
          <input
            type="number"
            className="input input-bordered w-full"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          />
          <label className="label">
            <span className="label-text-alt">
              Current: Rs {product.price.toLocaleString('en-PK')}
            </span>
          </label>
        </div>

        {/* Manufacturer */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Manufacturer</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={product.manufacturer || ""}
            onChange={(e) => setProduct({ ...product, manufacturer: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stock Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">In Stock?</span>
            </label>
            <select
              className="select select-bordered"
              value={product.inStock}
              onChange={(e) => setProduct({ ...product, inStock: Number(e.target.value) })}
            >
              <option value={1}>Yes</option>
              <option value={0}>No</option>
            </select>
          </div>

          {/* Total Stock */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Total Stock</span>
            </label>
            <input
              type="number"
              min="0"
              className="input input-bordered"
              value={product.totalStock}
              onChange={(e) => setProduct({ ...product, totalStock: Number(e.target.value) })}
            />
          </div>

          {/* Reorder Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Reorder Level</span>
            </label>
            <input
              type="number"
              min="0"
              className="input input-bordered"
              value={product.reorderLevel}
              onChange={(e) => setProduct({ ...product, reorderLevel: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Category */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Category</span>
          </label>
          <select
            className="select select-bordered"
            value={product.categoryId}
            onChange={(e) => setProduct({ ...product, categoryId: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Image */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Main Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            className="file-input file-input-bordered w-full"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                uploadFile(selectedFile);
                setProduct({ ...product, mainImage: selectedFile.name });
              }
            }}
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
          )}
          {product.mainImage && !uploading && (
            <div className="mt-4">
              <Image
                src={`/${product.mainImage}`}
                alt={product.title}
                width={200}
                height={200}
                className="rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* Other Images */}
        {otherImages.length > 0 && (
          <div>
            <label className="label">
              <span className="label-text font-semibold">Other Images</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {otherImages.map((image) => (
                <Image
                  key={nanoid()}
                  src={`/${image.image}`}
                  alt="Product image"
                  width={100}
                  height={100}
                  className="rounded-lg border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered h-32"
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={updateProduct}
            className="btn btn-primary flex-1"
          >
            Update Product
          </button>
          <button
            onClick={deleteProduct}
            className="btn btn-error text-white"
          >
            Delete Product
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Note: To delete a product, you must first remove it from all orders.
        </p>
      </div>
    </div>
  );
};

export default AdminProductEdit;