import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Get date from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch new arrivals
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          inStock: { gt: 0 },
          // If your Product model has createdAt field, uncomment this:
          // createdAt: { gte: thirtyDaysAgo }
        },
        include: {
          category: true,
          deal: true,  // ✅ ADD THIS LINE
          images: {
            select: {
              imageID: true,
              image: true,
            },
          },
        },
        orderBy: {
          id: 'desc', // Change to createdAt: 'desc' if you have that field
        },
        take: limit,
        skip: skip,
      }),
      prisma.product.count({
        where: {
          inStock: { gt: 0 },
          // createdAt: { gte: thirtyDaysAgo }
        },
      }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch new arrivals' },
      { status: 500 }
    );
  }
}