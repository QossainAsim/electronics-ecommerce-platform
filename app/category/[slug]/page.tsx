import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Deal {
  id: string;
  productId: string;
  discountPercent: number;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  inStock: number;
  mainImage?: string;
  deal?: Deal | null;  // ✅ Use deal instead of discountPrice
  images?: Array<{
    imageID?: string;
    image?: {
      imageID: string;
      imageUrl: string;
    };
    imageUrl?: string;
  }>;
  category?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  children?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface CategoryData {
  category: Category;
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function getCategoryProducts(slug: string): Promise<CategoryData | null> {
  try {
    // ✅ Using Express backend (port 3001)
    const res = await fetch(
      `http://localhost:3001/api/categories/${slug}/products`,
      { cache: 'no-store' }
    );
    
    if (!res.ok) {
      console.error(`Failed to fetch category: ${res.status} ${res.statusText}`);
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching category products:', error);
    return null;
  }
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  console.log('📦 Fetching category:', slug);
  const data = await getCategoryProducts(slug);
  
  if (!data) {
    console.error('❌ Category not found:', slug);
    notFound();
  }

  const { category, products, pagination } = data;
  console.log('✅ Category loaded:', category.name, `(${products.length} products)`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-6">
          <nav className="text-sm mb-4">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:underline">Categories</Link>
            <span className="mx-2">/</span>
            <span>{category.name}</span>
          </nav>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-blue-100 text-lg">{category.description}</p>
          )}
          <p className="text-blue-200 mt-4">
            {pagination.total} {pagination.total === 1 ? 'product' : 'products'} available
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Browse Subcategories</h2>
            <div className="flex flex-wrap gap-3">
              {category.children.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/category/${subcategory.slug}`}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all font-medium shadow-sm"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
            <Link 
              href="/categories"
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Browse other categories →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // ✅ Calculate discount from deal
              const hasActiveDeal = product.deal?.isActive === true;
              const discountPercent = hasActiveDeal ? (product.deal?.discountPercent || 0) : 0;
              const discountedPrice = hasActiveDeal 
                ? product.price - (product.price * discountPercent / 100)
                : null;

              // Get product image
              const getProductImage = () => {
                if (product.images && product.images.length > 0) {
                  const firstImage = product.images[0];
                  if (firstImage.image?.imageUrl) {
                    return firstImage.image.imageUrl;
                  }
                  if (firstImage.imageUrl) {
                    return firstImage.imageUrl;
                  }
                }
                if (product.mainImage) {
                  return `/${product.mainImage}`;
                }
                return '/placeholder-product.png';
              };

              const imageUrl = getProductImage();

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                    
                    {/* ✅ Discount Badge from Deal */}
                    {hasActiveDeal && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {discountPercent}% OFF
                      </div>
                    )}
                    
                    {product.inStock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    {/* ✅ Price with Deal discount */}
                    <div className="flex items-center gap-2">
                      {discountedPrice ? (
                        <>
                          <span className="text-xl font-bold text-blue-600">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-800">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    {product.inStock > 0 && product.inStock < 10 && (
                      <p className="text-orange-600 text-sm mt-2 font-medium">
                        Only {product.inStock} left!
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const data = await getCategoryProducts(slug);
  
  if (!data) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${data.category.name} - Shop Now`,
    description: data.category.description || `Browse ${data.category.name} products`
  };
}