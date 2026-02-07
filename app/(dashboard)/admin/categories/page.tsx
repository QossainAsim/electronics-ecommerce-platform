"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: {
    name: string;
  };
  _count?: {
    products: number;
    children: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DashboardCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"all" | "parents" | "children">("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIXED: Use apiClient to route to Express
      const response = await apiClient.get("/api/categories/all");

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        console.error("Unexpected data format:", data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all subcategories and unlink products.`)) {
      return;
    }

    try {
      // ✅ FIXED: Use apiClient.delete to route to Express
      const response = await apiClient.delete(`/api/categories/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || "Failed to delete category");
      }

      const result = await response.json();
      
      // Refresh categories list
      fetchCategories();
      
      alert(result.message || `Category "${name}" deleted successfully`);
    } catch (err) {
      console.error("Error deleting category:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      alert(errorMessage);
    }
  };

  // Filter categories based on view mode
  const getFilteredCategories = () => {
    switch (viewMode) {
      case "parents":
        return categories.filter((c) => !c.parentId);
      case "children":
        return categories.filter((c) => c.parentId);
      default:
        return categories;
    }
  };

  const filteredCategories = getFilteredCategories();
  const parentCategories = categories.filter((c) => !c.parentId);
  const subcategories = categories.filter((c) => c.parentId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Categories</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage your product categories ({categories.length} total)
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          + Add New Category
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Categories</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {categories.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Parent Categories</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {parentCategories.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Subcategories</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {subcategories.length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow p-1 inline-flex">
        <button
          onClick={() => setViewMode("all")}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === "all"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({categories.length})
        </button>
        <button
          onClick={() => setViewMode("parents")}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === "parents"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Parents Only ({parentCategories.length})
        </button>
        <button
          onClick={() => setViewMode("children")}
          className={`px-4 py-2 rounded-md transition-colors ${
            viewMode === "children"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Subcategories Only ({subcategories.length})
        </button>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug:</strong> Found {categories.length} categories 
        ({parentCategories.length} parents, {subcategories.length} subcategories)
        {subcategories.length > 0 && (
          <span className="ml-2 text-green-600">✓ Subcategories detected!</span>
        )}
      </div>

      {/* Categories Table */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Categories in This View
          </h3>
          <p className="text-gray-500 mb-6">
            {viewMode === "children" 
              ? "No subcategories found. Create a category with a parent ID to see it here."
              : "Get started by creating your first category"}
          </p>
          <Link
            href="/admin/categories/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Category
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category: Category) => (
                  <tr 
                    key={category.id} 
                    className={`hover:bg-gray-50 ${
                      category.parentId ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {category.parentId && (
                          <span className="mr-2 text-blue-500">└─</span>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              category.parentId ? "text-blue-700" : "text-gray-900"
                            }`}>
                              {category.name}
                            </span>
                            {category.parentId && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                Subcategory
                              </span>
                            )}
                            {!category.parentId && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                Parent
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs mt-1">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.parent ? (
                        <span className="text-sm text-blue-600 font-medium">
                          {category.parent.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Parent Category
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {category._count?.children || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}