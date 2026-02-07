import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

// POST create a new coupon
export async function POST(request: Request) {
  try {
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      expiryDate,
      isActive,
    } = await request.json();

    if (!code || !discountType || !discountValue || !expiryDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const upperCode = code.toUpperCase();

    // Check for duplicate code
    const existing = await prisma.coupon.findUnique({ where: { code: upperCode } });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: upperCode,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount || 0,
        maxDiscount: discountType === "percentage" ? maxDiscount : null,
        usageLimit: usageLimit || 1,
        expiryDate: new Date(expiryDate),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}