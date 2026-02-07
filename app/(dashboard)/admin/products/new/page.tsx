"use client";
import apiClient from "@/lib/api";
import { convertCategoryNameToURLFriendly as convertSlugToURLFriendly } from "@/utils/categoryFormating";
import { sanitizeFormData } from "@/lib/form-sanitize";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddNewProduct = () => {
  const [product, setProduct] = useState<{
    merchantId?: string;
    title: string;
    price: number;
    manufacturer: string;
    inStock: number;
    totalStock: number;
    reorderLevel: number;
    mainImage: string;
    description: string;
    slug: string;
    categoryId: string;
  }>({
    merchantId: "",
    title: "",
    price: 0,
    manufacturer: "",
    inStock: 1,
    totalStock: 0,
    reorderLevel: 10,
    mainImage: "",
    description: "",
    slug: "",
    categoryId: "",
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingMultiple, setUploadingMultiple] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const addProduct = async () => {
    if (
      !product.merchantId ||
      product.title === "" ||
      product.manufacturer === "" ||
      product.description === "" ||
      product.slug === ""
    ) {
      toast.error("Please enter values in all required fields");
      return;
    }

    try {
      const sanitizedProduct = sanitizeFormData(product);
      console.log("Sending product data:", sanitizedProduct);

      const response = await apiClient.post(`/api/products`, sanitizedProduct);

      if (response.status === 201) {
        const data = await response.json();
        console.log("Product created successfully:", data);
        
        // If there are additional images, save them to product_image table
        if (additionalImages.length > 0) {
          await saveAdditionalImages(data.id);
        }
        
        toast.success("Product added successfully");
        
        // Reset form
        setProduct({
          merchantId: merchants[0]?.id || "",
          title: "",
          price: 0,
          manufacturer: "",
          inStock: 1,
          totalStock: 0,
          reorderLevel: 10,
          mainImage: "",
          description: "",
          slug: "",
          categoryId: categories[0]?.id || "",
        });
        setAdditionalImages([]);
        setImagePreview("");
      } else {
        const errorData = await response.json();
        console.error("Failed to create product:", errorData);
        toast.error(`Error: ${errorData.message || "Failed to add product"}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const saveAdditionalImages = async (productId: string) => {
    try {
      for (let i = 0; i < additionalImages.length; i++) {
        const imageData = {
          productID: productId,
          image: additionalImages[i],
        };
        
        await apiClient.post(`/api/images`, imageData);
      }
      console.log("✅ Additional images saved");
    } catch (error) {
      console.error("Error saving additional images:", error);
      toast.error("Some images failed to save");
    }
  };

  const fetchMerchants = async () => {
    try {
      const res = await apiClient.get("/api/merchants");
      const data = await res.json();
      
      const merchantsArray = Array.isArray(data) ? data : [];
      setMerchants(merchantsArray);
      
      setProduct((prev) => ({
        ...prev,
        merchantId: prev.merchantId || merchantsArray?.[0]?.id || "",
      }));
    } catch (e) {
      console.error("Error fetching merchants:", e);
      toast.error("Failed to load merchants");
      setMerchants([]);
    }
  };

  const uploadFile = async (file: File, isMainImage: boolean = true) => {
    const formData = new FormData();
    formData.append("uploadedFile", file);
    
    if (isMainImage) {
      setUploading(true);
    } else {
      setUploadingMultiple(true);
    }

    try {
      const response = await fetch("/api/main-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("File uploaded:", data);
        
        if (isMainImage) {
          setProduct((prev) => ({ ...prev, mainImage: data.filename }));
          setImagePreview(data.filename);
          toast.success("Main image uploaded successfully");
        } else {
          // Add to additional images
          setAdditionalImages((prev) => [...prev, data.filename]);
          toast.success("Additional image uploaded");
        }
      } else {
        console.error("File upload unsuccessful");
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error happened while sending request:", error);
      toast.error("Error uploading image");
    } finally {
      if (isMainImage) {
        setUploading(false);
      } else {
        setUploadingMultiple(false);
      }
    }
  };

  const uploadMultipleFiles = async (files: FileList) => {
    if (additionalImages.length + files.length > 5) {
      toast.error("Maximum 5 additional images allowed");
      return;
    }

    setUploadingMultiple(true);

    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i], false);
    }

    setUploadingMultiple(false);
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

  const fetchCategories = async () => {
    try {
      const res = await apiClient.get(`/api/categories`);
      const data = await res.json();
      
      setCategories(data);
      setProduct((prev) => ({
        ...prev,
        categoryId: data[0]?.id || "",
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMerchants();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>
        
        <div className="space-y-6">
          {/* Merchant Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Merchant Info: <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={product?.merchantId}
              onChange={(e) =>
                setProduct({ ...product, merchantId: e.target.value })
              }
            >
              {merchants.length === 0 && (
                <option value="">No merchants available</option>
              )}
              {merchants.map((merchant) => (
                <option key={merchant.id} value={merchant.id}>
                  {merchant.name}
                </option>
              ))}
            </select>
            {merchants.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                ⚠️ Please create a merchant first.
              </p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={product?.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              placeholder="e.g., iPhone 15 Pro"
            />
          </div>

          {/* Product Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Slug: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
              value={convertSlugToURLFriendly(product?.slug)}
              onChange={(e) =>
                setProduct({
                  ...product,
                  slug: convertSlugToURLFriendly(e.target.value),
                })
              }
              placeholder="e.g., iphone-15-pro"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category: <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={product?.categoryId}
              onChange={(e) =>
                setProduct({ ...product, categoryId: e.target.value })
              }
            >
              {categories &&
                categories.map((category: any) => (
                  <option key={category?.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Price ($): <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={product?.price}
              onChange={(e) =>
                setProduct({ ...product, price: Number(e.target.value) })
              }
              placeholder="99.99"
            />
          </div>

          {/* Manufacturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={product?.manufacturer}
              onChange={(e) =>
                setProduct({ ...product, manufacturer: e.target.value })
              }
              placeholder="e.g., Apple"
            />
          </div>

          {/* Stock Management Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* In Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Is product in stock?
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={product?.inStock}
                  onChange={(e) =>
                    setProduct({ ...product, inStock: Number(e.target.value) })
                  }
                >
                  <option value={1}>Yes - In Stock</option>
                  <option value={0}>No - Out of Stock</option>
                </select>
              </div>

              {/* Total Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Stock Quantity:
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={product?.totalStock}
                  onChange={(e) =>
                    setProduct({ ...product, totalStock: Number(e.target.value) })
                  }
                  placeholder="100"
                />
              </div>

              {/* Reorder Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reorder Level:
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={product?.reorderLevel}
                  onChange={(e) =>
                    setProduct({ ...product, reorderLevel: Number(e.target.value) })
                  }
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this level
                </p>
              </div>
            </div>
          </div>

          {/* ✅ IMPROVED: Main Image Upload with Preview */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Main Product Image: <span className="text-red-500">*</span>
            </label>
            
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                {imagePreview ? (
                  <Image
                    src={`/${imagePreview}`}
                    alt="Main product preview"
                    width={192}
                    height={192}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-sm">No image</p>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  id="main-image-input"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      uploadFile(e.target.files[0], true);
                    }
                  }}
                />
                <label
                  htmlFor="main-image-input"
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                    uploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading..." : "Choose Image"}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
                {imagePreview && !uploading && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("");
                      setProduct({ ...product, mainImage: "" });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ✅ NEW: Additional Images Upload */}
          <div className="border border-gray-300 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Additional Images (Max 5)
            </label>
            
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploadingMultiple || additionalImages.length >= 5}
              id="additional-images-input"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  uploadMultipleFiles(e.target.files);
                }
              }}
            />
            <label
              htmlFor="additional-images-input"
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                uploadingMultiple || additionalImages.length >= 5
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {uploadingMultiple ? "Uploading..." : "+ Add Images"}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {additionalImages.length}/5 images uploaded
            </p>

            {/* Additional Images Grid */}
            {additionalImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {additionalImages.map((img, index) => (
                  <div key={index} className="relative group aspect-square border border-gray-200 rounded-lg overflow-hidden">
                    <Image
                      src={`/${img}`}
                      alt={`Additional ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description: <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={6}
              value={product?.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              placeholder="Detailed product description..."
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={addProduct}
              type="button"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewProduct;