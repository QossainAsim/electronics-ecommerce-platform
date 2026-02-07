const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all categories (for admin panel - flat list)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching all categories:", error);
    res.status(500).json({ 
      error: "Failed to fetch categories",
      details: error.message 
    });
  }
};

// GET parent categories only (for homepage)
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null  // ✅ Only parent categories
      },
      include: {
        children: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ 
      error: "Failed to fetch categories",
      details: error.message 
    });
  }
};

// GET single category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    res.status(500).json({ 
      error: "Failed to fetch category",
      details: error.message 
    });
  }
};

// GET single category by ID (for admin panel)
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          orderBy: { name: 'asc' }
        },
        products: {
          select: {
            id: true,
            title: true,
            price: true,
            inStock: true,
            mainImage: true,
          },
          take: 50,
          orderBy: {
            id: 'desc'  // ✅ FIXED: Changed from createdAt to id
          }
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ 
      error: "Failed to fetch category",
      details: error.message 
    });
  }
};

// GET products by category slug
exports.getCategoryProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || 'id';  // ✅ FIXED: Changed default from createdAt to id
    const order = req.query.order || 'desc';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;

    // Find the category
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // ✅ Get category IDs including children (for hierarchical filtering)
    const categoryIds = [category.id, ...category.children.map(c => c.id)];

    // Build where clause for products
    const where = {
      categoryId: { in: categoryIds },
    };

    // Add price filters if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.AND = {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      };
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // ✅ FIXED: Build orderBy based on valid fields only
    let orderByClause = {};
    const validSortFields = ['id', 'title', 'price', 'rating', 'inStock'];
    
    if (validSortFields.includes(sortBy)) {
      orderByClause[sortBy] = order;
    } else {
      orderByClause.id = 'desc';  // Default fallback
    }

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        slug: true,
        title: true,
        mainImage: true,
        price: true,
        rating: true,
        inStock: true,
        images: {
          select: {
            imageID: true,
            image: true
          },
          take: 1
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        // ✅ ADDED: Include deal data
        deal: {
          select: {
            id: true,
            productId: true,
            discountPercent: true,
            startDate: true,
            endDate: true,
            isActive: true,
          }
        }
      },
      orderBy: orderByClause,  // ✅ FIXED: Use validated orderBy
      skip: (page - 1) * limit,
      take: limit,
    });

    // ✅ Transform products to match expected format
    const transformedProducts = products.map(product => ({
      ...product,
      images: product.images.map(img => ({
        imageUrl: img.image.startsWith('/') ? img.image : `/${img.image}`
      }))
    }));

    res.json({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        children: category.children || [],
        parent: category.parent || null
      },
      products: transformedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ 
      error: "Failed to fetch products",
      details: error.message 
    });
  }
};

// CREATE new category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, icon, image, parentId } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this slug already exists' });
    }

    // Create category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        image,
        parentId: parentId || null
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ 
      error: "Failed to create category",
      details: error.message 
    });
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, icon, image, parentId } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Prevent circular reference (category can't be its own parent)
    if (parentId === id) {
      return res.status(400).json({ error: 'Category cannot be its own parent' });
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name || existingCategory.name,
        slug: slug || existingCategory.slug,
        description: description !== undefined ? description : existingCategory.description,
        icon: icon !== undefined ? icon : existingCategory.icon,
        image: image !== undefined ? image : existingCategory.image,
        parentId: parentId !== undefined ? (parentId || null) : existingCategory.parentId
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ 
      error: "Failed to update category",
      details: error.message 
    });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
            children: true
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has products
    if (category._count.products > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with products',
        message: `This category has ${category._count.products} products. Please reassign them first.`
      });
    }

    // Check if category has children
    if (category._count.children > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with subcategories',
        message: `This category has ${category._count.children} subcategories. Please delete them first.`
      });
    }

    // Delete category
    await prisma.category.delete({
      where: { id },
    });

    res.json({ 
      success: true,
      message: 'Category deleted successfully',
      deletedCategory: {
        id: category.id,
        name: category.name,
      }
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ 
      error: "Failed to delete category",
      details: error.message 
    });
  }
};

module.exports = exports;