import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function GET() {
  try {
    const now = new Date();

    // Fetch active coupons that haven't expired and haven't reached usage limit
    const coupons = await prisma.coupon.findMany({
      where: {
        isActive: true,
        expiryDate: { gte: now },
      },
      orderBy: {
        discountValue: 'desc', // Show best discounts first
      },
    });

    // Filter out coupons that have reached their usage limit
    const availableCoupons = coupons.filter(
      (coupon) => coupon.usedCount < coupon.usageLimit
    );

    return NextResponse.json({
      coupons: availableCoupons,
      total: availableCoupons.length,
    });
  } catch (error) {
    console.error('Error fetching active coupons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}