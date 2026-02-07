import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const now = new Date();

    // Fetch products with active deals
    // @ts-ignore - Prisma client typing issue
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
        include: {
          product: {
            include: {
              category: true,
              images: {
                select: {
                  imageID: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          discountPercent: 'desc', // Show biggest discounts first
        },
        take: limit,
        skip: skip,
      }),
      // @ts-ignore - Prisma client typing issue
      prisma.deal.count({
        where: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
    ]);

    // Transform data to include discount info
    const dealsWithProducts = deals.map((deal: any) => ({
      ...deal.product,
      deal: {
        id: deal.id,
        discountPercent: deal.discountPercent,
        startDate: deal.startDate,
        endDate: deal.endDate,
        originalPrice: deal.product.price,
        discountedPrice: Math.round(
          deal.product.price * (1 - deal.discountPercent / 100)
        ),
        savings: Math.round(deal.product.price * (deal.discountPercent / 100)),
      },
    }));

    return NextResponse.json({
      products: dealsWithProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}