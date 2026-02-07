import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET single coupon
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id: params.id } });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error fetching coupon:", error);
    return NextResponse.json({ error: "Failed to fetch coupon" }, { status: 500 });
  }
}

// PATCH update coupon
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updateData: any = {};

    if (body.code !== undefined) updateData.code = body.code.toUpperCase();
    if (body.discountType !== undefined) updateData.discountType = body.discountType;
    if (body.discountValue !== undefined) updateData.discountValue = body.discountValue;
    if (body.minOrderAmount !== undefined) updateData.minOrderAmount = body.minOrderAmount;
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit;
    if (body.expiryDate !== undefined) updateData.expiryDate = new Date(body.expiryDate);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const coupon = await prisma.coupon.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

// DELETE coupon
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}