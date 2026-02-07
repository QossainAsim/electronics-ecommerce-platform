import Link from 'next/link';
import { 
  FaMobileAlt, 
  FaLaptop, 
  FaCamera, 
  FaClock, 
  FaTabletAlt, 
  FaHeadphones,
  FaDesktop,
  FaPrint 
} from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  _count?: {
    products: number;
  };
}

const categoryIcons: { [key: string]: any } = {
  'FaMobileAlt': FaMobileAlt,
  'FaLaptop': FaLaptop,
  'FaCamera': FaCamera,
  'FaClock': FaClock,
  'FaTabletAlt': FaTabletAlt,
  'FaHeadphones': FaHeadphones,
  'FaDesktop': FaDesktop,
  'FaPrint': FaPrint,
};

async function getCategories() {
  try {
    const res = await fetch('http://localhost:3000/api/categories', {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch categories');
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesSection() {
  const categories: Category[] = await getCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Shop by Category</h2>
        <Link 
          href="/categories" 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon ? categoryIcons[category.icon] : FaMobileAlt;
          
          return (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 flex items-center justify-center bg-white rounded-full mb-3 group-hover:bg-blue-600 transition-colors shadow-md">
                <IconComponent className="text-3xl text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-semibold text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
              {category._count && (
                <span className="text-xs text-gray-500 mt-1">
                  {category._count.products} items
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}