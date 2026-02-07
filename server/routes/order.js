const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');

// ✅ IMPORTANT: Specific routes MUST come BEFORE generic :id routes
// Otherwise /user/email will match /:id and treat "user" as an ID

// User-specific routes (MUST be first)
router.get('/user/:email', orderController.getOrdersByEmail);      // Get orders by email
router.get('/user/:email/stats', orderController.getUserStats);    // Get user stats

// General CRUD routes
router.post('/', orderController.createOrder);                     // Create order
router.get('/', orderController.getAllOrders);                     // Get all orders
router.get('/:id', orderController.getOrderById);                  // Get single order by ID
router.put('/:id', orderController.updateOrder);                   // Update order
router.delete('/:id', orderController.deleteOrder);                // Delete order

module.exports = router;