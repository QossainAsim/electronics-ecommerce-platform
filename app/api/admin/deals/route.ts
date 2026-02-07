import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET all deals
export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { startDate: "desc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            mainImage: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ deals });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 });
  }
}

// POST create a new deal
export async function POST(request: Request) {
  try {
    const { productId, discountPercent, endDate, isActive } = await request.json();

    if (!productId || !discountPercent || !endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if deal already exists for this product
    const existing = await prisma.deal.findUnique({ where: { productId } });
    if (existing) {
      return NextResponse.json(
        { error: "A deal already exists for this product" },
        { status: 400 }
      );
    }

    const deal = await prisma.deal.create({
      data: {
        productId,
        discountPercent,
        endDate: new Date(endDate),
        isActive: isActive ?? true,
      },
      include: {
        product: {
          select: { id: true, title: true, mainImage: true, price: true },
        },
      },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}