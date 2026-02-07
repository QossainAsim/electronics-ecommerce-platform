import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// GET single deal
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        product: {
          select: { id: true, title: true, mainImage: true, price: true },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 });
  }
}

// PATCH update deal
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updateData: any = {};

    if (body.discountPercent !== undefined) updateData.discountPercent = body.discountPercent;
    if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const deal = await prisma.deal.update({
      where: { id: params.id },
      data: updateData,
      include: {
        product: {
          select: { id: true, title: true, mainImage: true, price: true },
        },
      },
    });

    return NextResponse.json({ deal });
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}

// DELETE deal
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.deal.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}