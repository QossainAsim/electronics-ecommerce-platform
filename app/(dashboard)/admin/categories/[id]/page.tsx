import { notFound } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  parent?: {
    id: string;
    name: string;
    slug: string;
  };
  products?: Array<{
    id: string;
    title: string;
    price: number;
    inStock: number;
  }>;
  _count?: {
    products: number;
  };
  createdAt: string;
  updatedAt: string;
}

async function getCategoryDetails(id: string): Promise<Category | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/categories/id/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

export default async function DashboardSingleCategory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Await params before using
  const resolvedParams = await params;
  const category = await getCategoryDetails(resolvedParams.id);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/admin/categories"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Categories
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
          <p className="text-gray-600 mt-1">Category Details</p>
        </div>
        <Link
          href={`/admin/categories/${category.id}/edit`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Edit Category
        </Link>
      </div>

      {/* Category Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">
            {category._count?.products || 0}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Category Type</h3>
          <p className="text-xl font-semibold text-gray-800">
            {category.parentId ? "Subcategory" : "Parent Category"}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Status</h3>
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Category Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Category ID
              </label>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                {category.id}
              </p>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Slug
              </label>
              <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">
                {category.slug}
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Name
              </label>
              <p className="text-gray-900">{category.name}</p>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Icon
              </label>
              <p className="text-gray-900">{category.icon || "None"}</p>
            </div>

            {/* Parent Category */}
            {category.parent && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Parent Category
                </label>
                <Link
                  href={`/admin/categories/${category.parent.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {category.parent.name}
                </Link>
              </div>
            )}

            {/* Created At */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created At
              </label>
              <p className="text-gray-900">
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Updated At */}
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Updated
              </label>
              <p className="text-gray-900">
                {new Date(category.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Description */}
            {category.description && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-gray-900">{category.description}</p>
              </div>
            )}

            {/* Image */}
            {category.image && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Image URL
                </label>
                <a
                  href={category.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {category.image}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products List */}
      {category.products && category.products.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              Products in This Category ({category.products.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {category.products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.title}
                      </div>
                      <div className="text-sm text-gray-500 font-mono">
                        {product.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock > 0
                          ? `${product.inStock} in stock`
                          : "Out of stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Products Message */}
      {(!category.products || category.products.length === 0) && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">No products in this category yet</p>
          <Link
            href="/admin/products/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Product
          </Link>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const category = await getCategoryDetails(resolvedParams.id);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} - Category Details`,
  };
}