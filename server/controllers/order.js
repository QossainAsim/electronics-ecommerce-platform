const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE new order
exports.createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      address,
      apartment,
      city,
      country,
      postalCode,
      products, // Array of { productId, quantity, price }
      totalPrice,
      couponCode,        // ✅ ADDED
      discountAmount     // ✅ ADDED
    } = req.body;

    console.log('📦 Received order request:', { 
      email, 
      productsCount: products?.length,
      totalPrice,
      couponCode: couponCode || 'None',      // ✅ LOG COUPON
      discountAmount: discountAmount || 0    // ✅ LOG DISCOUNT
    });

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !country || !postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({ error: 'No products in order' });
    }

    // ✅ CREATE ORDER with transaction to ensure stock updates AND coupon tracking atomically
    const order = await prisma.$transaction(async (tx) => {
      console.log('🔍 Starting transaction...');

      // 1. STOCK CHECK - Verify all products have enough stock FIRST
      for (const item of products) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        console.log(`📊 Stock check for ${product.title}:`, {
          totalStock: product.totalStock,
          inStock: product.inStock,
          requested: item.quantity
        });

        if (product.totalStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.title}. Only ${product.totalStock} available, but ${item.quantity} requested.`
          );
        }
      }

      // 2. Create the order
      console.log('✍️ Creating order...');
      const newOrder = await tx.customer_order.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          company: company || '',
          address,
          apartment: apartment || '',
          city,
          country,
          postalCode,
          totalPrice: parseFloat(totalPrice),
          status: 'pending',
        }
      });
      console.log('✅ Order created:', newOrder.id);

      // 3. Create order products and REDUCE STOCK
      for (const item of products) {
        // Get current product stock
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        const newTotalStock = product.totalStock - item.quantity;
        const newInStock = newTotalStock; // ✅ inStock is an Int, not Boolean!

        console.log(`📦 Processing ${product.title}:`);
        console.log(`   Current: totalStock=${product.totalStock}, inStock=${product.inStock}`);
        console.log(`   Ordered: ${item.quantity} units`);
        console.log(`   New values: totalStock=${newTotalStock}, inStock=${newInStock}`);

        // Add product to order
        await tx.customer_order_product.create({
          data: {
            customerOrderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: parseFloat(item.price) || parseFloat(product.price),
          }
        });

        // ✅ REDUCE BOTH totalStock AND inStock (both are Int!)
        await tx.product.update({
          where: { id: item.productId },
          data: {
            totalStock: newTotalStock,
            inStock: newInStock  // ✅ Update inStock too (it's an Int, not Boolean)
          }
        });

        console.log(`✅ Stock updated successfully for ${product.title}`);
      }

      // ✅ 4. UPDATE COUPON if one was used
      if (couponCode && discountAmount) {
        const parsedDiscount = parseFloat(discountAmount);
        
        console.log(`🎫 Processing coupon: ${couponCode}, Discount: Rs. ${parsedDiscount}`);

        // Find the coupon
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode }
        });

        if (coupon) {
          console.log(`📊 Current coupon state:`);
          console.log(`   - Code: ${coupon.code}`);
          console.log(`   - Used Count: ${coupon.usedCount}/${coupon.usageLimit}`);
          console.log(`   - Total Discount Given: Rs. ${coupon.totalDiscountGiven || 0}`);
          console.log(`   - Active: ${coupon.isActive}`);

          // ✅ Update coupon usage and total discount given
          const updatedCoupon = await tx.coupon.update({
            where: { code: couponCode },
            data: {
              usedCount: {
                increment: 1  // ✅ Increase usage count by 1
              },
              totalDiscountGiven: {
                increment: Math.round(parsedDiscount)  // ✅ Add discount amount (in rupees)
              }
            }
          });

          console.log(`✅ Coupon UPDATED successfully!`);
          console.log(`   - New Used Count: ${updatedCoupon.usedCount}`);
          console.log(`   - New Total Discount Given: Rs. ${updatedCoupon.totalDiscountGiven}`);
        } else {
          console.log(`⚠️ WARNING: Coupon not found in database: ${couponCode}`);
        }
      } else {
        console.log(`ℹ️ No coupon applied to this order`);
      }

      return newOrder;
    });

    console.log('🎉 Transaction completed successfully!');

    // Return created order with products
    const orderWithProducts = await prisma.customer_order.findUnique({
      where: { id: order.id },
      include: {
        customer_order_products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                totalStock: true,
                inStock: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      order: orderWithProducts,
      message: 'Order created successfully! Stock has been updated.'
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
};

// GET all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.customer_order.findMany({
      include: {
        customer_order_products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                totalStock: true,
                inStock: true
              }
            }
          }
        }
      },
      orderBy: {
        dateTime: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

// GET single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.customer_order.findUnique({
      where: { id },
      include: {
        customer_order_products: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
};

// UPDATE order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const order = await prisma.customer_order.update({
      where: { id },
      data: updateData,
      include: {
        customer_order_products: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      details: error.message 
    });
  }
};

// DELETE order (with stock restoration)
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async (tx) => {
      // Get order with products to restore stock
      const order = await tx.customer_order.findUnique({
        where: { id },
        include: {
          customer_order_products: {
            include: {
              product: true
            }
          }
        }
      });

      if (!order) {
        throw new Error('Order not found');
      }

      // ✅ RESTORE STOCK when deleting order
      for (const orderProduct of order.customer_order_products) {
        const newTotalStock = orderProduct.product.totalStock + orderProduct.quantity;
        const newInStock = newTotalStock; // inStock is Int

        await tx.product.update({
          where: { id: orderProduct.productId },
          data: {
            totalStock: newTotalStock,
            inStock: newInStock
          }
        });

        console.log(`♻️ Stock restored for ${orderProduct.product.title}: +${orderProduct.quantity} units`);
      }

      // Delete order products
      await tx.customer_order_product.deleteMany({
        where: { customerOrderId: id }
      });

      // Delete order
      await tx.customer_order.delete({
        where: { id }
      });
    });

    res.json({ 
      success: true,
      message: 'Order deleted successfully and stock restored' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      error: 'Failed to delete order',
      details: error.message 
    });
  }
};

exports.getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    console.log('📧 Fetching orders for email:', email);

    // Validate email parameter
    if (!email) {
      return res.status(400).json({ 
        error: 'Email is required' 
      });
    }

    // ✅ MYSQL FIX: Remove mode: 'insensitive' and use toLowerCase() instead
    const normalizedEmail = email.toLowerCase();

    // Fetch orders for this user, sorted by most recent first
    const orders = await prisma.customer_order.findMany({
      where: {
        email: normalizedEmail  // ✅ Simple equality check (MySQL compatible)
      },
      include: {
        customer_order_products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                price: true,
                totalStock: true,
                inStock: true
              }
            }
          }
        }
      },
      orderBy: {
        dateTime: 'desc' // Most recent first
      }
    });

    console.log(`✅ Found ${orders.length} orders for ${normalizedEmail}`);

    // If no orders found
    if (!orders || orders.length === 0) {
      return res.status(200).json({ 
        orders: [],
        total: 0,
        message: 'No orders found for this user'
      });
    }

    // Return orders
    res.status(200).json({
      orders,
      total: orders.length
    });

  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

// GET user statistics by email (MYSQL COMPATIBLE VERSION)
exports.getUserStats = async (req, res) => {
  try {
    const { email } = req.params;

    console.log('📊 Fetching stats for email:', email);

    // ✅ MYSQL FIX: Normalize email
    const normalizedEmail = email.toLowerCase();

    // Fetch all orders for this user
    const orders = await prisma.customer_order.findMany({
      where: {
        email: normalizedEmail  // ✅ Simple equality check (MySQL compatible)
      },
      select: {
        totalPrice: true,
        status: true,
        dateTime: true
      }
    });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        memberSince: null,
        ordersByStatus: {}
      });
    }

    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalSpent / totalOrders;
    const memberSince = orders[orders.length - 1].dateTime; // First order date

    // Count by status
    const ordersByStatus = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    console.log(`✅ Stats calculated for ${normalizedEmail}:`, {
      totalOrders,
      totalSpent,
      averageOrderValue: Math.round(averageOrderValue)
    });

    res.status(200).json({
      totalOrders,
      totalSpent,
      averageOrderValue: Math.round(averageOrderValue),
      memberSince,
      ordersByStatus
    });

  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user statistics',
      details: error.message 
    });
  }
};


module.exports = exports;