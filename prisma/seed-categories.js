const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Starting category seeding...');

  try {
    // Main categories with icons
    const mainCategories = [
      {
        name: 'Mobile',
        slug: 'mobile',
        description: 'Smartphones and mobile devices',
        icon: 'FaMobileAlt'
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Laptops and notebooks',
        icon: 'FaLaptop'
      },
      {
        name: 'Cameras',
        slug: 'cameras',
        description: 'Digital cameras and accessories',
        icon: 'FaCamera'
      },
      {
        name: 'Smart Watches',
        slug: 'smart-watches',
        description: 'Smartwatches and fitness trackers',
        icon: 'FaClock'
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablets and e-readers',
        icon: 'FaTabletAlt'
      },
      {
        name: 'Headphones',
        slug: 'headphones',
        description: 'Headphones and audio devices',
        icon: 'FaHeadphones'
      },
      {
        name: 'PCs',
        slug: 'pcs',
        description: 'Desktop computers and components',
        icon: 'FaDesktop'
      },
      {
        name: 'Printers',
        slug: 'printers',
        description: 'Printers, scanners and office equipment',
        icon: 'FaPrint'
      }
    ];

    // Create main categories
    console.log('📦 Creating main categories...');
    for (const category of mainCategories) {
      const created = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          icon: category.icon
        },
        create: category
      });
      console.log(`✅ ${created.name}`);
    }

    // Subcategories for Mobile
    console.log('\n📱 Creating Mobile subcategories...');
    const mobileCategory = await prisma.category.findUnique({
      where: { slug: 'mobile' }
    });

    if (mobileCategory) {
      const mobileSubcategories = [
        { 
          name: 'Smart Phones', 
          slug: 'smart-phones',
          description: 'Latest smartphones from top brands',
          parentId: mobileCategory.id 
        },
        { 
          name: 'Feature Phones', 
          slug: 'feature-phones',
          description: 'Basic mobile phones',
          parentId: mobileCategory.id 
        },
        { 
          name: 'Mobile Accessories', 
          slug: 'mobile-accessories',
          description: 'Cases, chargers, screen protectors',
          parentId: mobileCategory.id 
        }
      ];

      for (const subcategory of mobileSubcategories) {
        const created = await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {
            name: subcategory.name,
            description: subcategory.description,
            parentId: subcategory.parentId
          },
          create: subcategory
        });
        console.log(`  ↳ ${created.name}`);
      }
    }

    // Subcategories for Laptops
    console.log('\n💻 Creating Laptop subcategories...');
    const laptopsCategory = await prisma.category.findUnique({
      where: { slug: 'laptops' }
    });

    if (laptopsCategory) {
      const laptopSubcategories = [
        { 
          name: 'Gaming Laptops', 
          slug: 'gaming-laptops',
          description: 'High-performance gaming laptops',
          parentId: laptopsCategory.id 
        },
        { 
          name: 'Business Laptops', 
          slug: 'business-laptops',
          description: 'Professional laptops for work',
          parentId: laptopsCategory.id 
        },
        { 
          name: 'Ultrabooks', 
          slug: 'ultrabooks',
          description: 'Thin and light premium laptops',
          parentId: laptopsCategory.id 
        },
        { 
          name: 'Chromebooks', 
          slug: 'chromebooks',
          description: 'Chrome OS laptops',
          parentId: laptopsCategory.id 
        }
      ];

      for (const subcategory of laptopSubcategories) {
        const created = await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {
            name: subcategory.name,
            description: subcategory.description,
            parentId: subcategory.parentId
          },
          create: subcategory
        });
        console.log(`  ↳ ${created.name}`);
      }
    }

    // Subcategories for Cameras
    console.log('\n📷 Creating Camera subcategories...');
    const camerasCategory = await prisma.category.findUnique({
      where: { slug: 'cameras' }
    });

    if (camerasCategory) {
      const cameraSubcategories = [
        { 
          name: 'DSLR Cameras', 
          slug: 'dslr-cameras',
          description: 'Digital SLR cameras',
          parentId: camerasCategory.id 
        },
        { 
          name: 'Mirrorless Cameras', 
          slug: 'mirrorless-cameras',
          description: 'Compact mirrorless cameras',
          parentId: camerasCategory.id 
        },
        { 
          name: 'Action Cameras', 
          slug: 'action-cameras',
          description: 'Sports and action cameras',
          parentId: camerasCategory.id 
        },
        { 
          name: 'Camera Lenses', 
          slug: 'camera-lenses',
          description: 'Camera lenses and accessories',
          parentId: camerasCategory.id 
        }
      ];

      for (const subcategory of cameraSubcategories) {
        const created = await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {
            name: subcategory.name,
            description: subcategory.description,
            parentId: subcategory.parentId
          },
          create: subcategory
        });
        console.log(`  ↳ ${created.name}`);
      }
    }

    // Subcategories for Headphones
    console.log('\n🎧 Creating Headphone subcategories...');
    const headphonesCategory = await prisma.category.findUnique({
      where: { slug: 'headphones' }
    });

    if (headphonesCategory) {
      const headphoneSubcategories = [
        { 
          name: 'Wireless Earbuds', 
          slug: 'wireless-earbuds',
          description: 'True wireless earbuds',
          parentId: headphonesCategory.id 
        },
        { 
          name: 'Over-Ear Headphones', 
          slug: 'over-ear-headphones',
          description: 'Full-size headphones',
          parentId: headphonesCategory.id 
        },
        { 
          name: 'Gaming Headsets', 
          slug: 'gaming-headsets',
          description: 'Gaming headphones with mic',
          parentId: headphonesCategory.id 
        }
      ];

      for (const subcategory of headphoneSubcategories) {
        const created = await prisma.category.upsert({
          where: { slug: subcategory.slug },
          update: {
            name: subcategory.name,
            description: subcategory.description,
            parentId: subcategory.parentId
          },
          create: subcategory
        });
        console.log(`  ↳ ${created.name}`);
      }
    }

    console.log('\n✅ Category seeding completed successfully!');
    console.log('📊 Summary:');
    
    const totalCategories = await prisma.category.count();
    const parentCategories = await prisma.category.count({
      where: { parentId: null }
    });
    const subcategories = totalCategories - parentCategories;
    
    console.log(`   - Total categories: ${totalCategories}`);
    console.log(`   - Parent categories: ${parentCategories}`);
    console.log(`   - Subcategories: ${subcategories}`);

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

seedCategories()
  .catch((e) => {
    console.error('❌ Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  });