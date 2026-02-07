const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category');

// ⚠️ IMPORTANT: Order matters! Specific routes MUST come before dynamic routes

// GET all categories (flat list) - Used by admin panel
// This MUST be before /:slug or it will be treated as a slug
router.get('/all', categoryController.getAllCategories);

// GET all parent categories with children - Used by homepage
router.get('/', categoryController.getCategories);

// GET products by category slug - MUST be before /:slug
router.get('/:slug/products', categoryController.getCategoryProducts);

// GET single category by slug - For category pages
router.get('/:slug', categoryController.getCategoryBySlug);

// GET single category by ID - For admin detail page
router.get('/id/:id', categoryController.getCategoryById);

// CREATE new category
router.post('/', categoryController.createCategory);

// UPDATE category
router.put('/:id', categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;