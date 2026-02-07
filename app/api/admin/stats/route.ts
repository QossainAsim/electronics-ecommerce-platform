import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function GET() {
  try {
    const [
      productCount,
      orderCount,
      userCount,
      activeDeals,
      activeCoupons,
      pendingInquiries,
      revenueResult,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.customer_order.count(),
      prisma.user.count(),
      prisma.deal.count({ where: { isActive: true } }),
      prisma.coupon.count({ where: { isActive: true } }),
      prisma.contactInquiry.count({ where: { status: 'pending' } }),
      prisma.customer_order.aggregate({
        _sum: { totalPrice: true },
      }),
    ]);

    // Recent orders (last 5)
    const recentOrders = await prisma.customer_order.findMany({
      orderBy: { dateTime: 'desc' },
      take: 5,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        totalPrice: true,
        status: true,
        dateTime: true,
      },
    });

    // Low stock products (inStock <= 3)
    const lowStockProducts = await prisma.product.findMany({
      where: { inStock: { lte: 3 } },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        mainImage: true,
        inStock: true,
      },
    });

    return NextResponse.json({
      stats: {
        totalProducts: productCount,
        totalOrders: orderCount,
        totalUsers: userCount,
        totalRevenue: revenueResult._sum.totalPrice || 0,
        activeDeals,
        activeCoupons,
        pendingInquiries,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}