import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single merchant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const merchant = await prisma.merchant.findUnique({
      where: { id: params.id },
      include: { products: true }
    });

    if (!merchant) {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(merchant);
  } catch (error: any) {
    console.error('Error fetching merchant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant' },
      { status: 500 }
    );
  }
}

// PATCH update merchant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const merchant = await prisma.merchant.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.email && { email: body.email }),
        ...(body.phone !== undefined && { phone: body.phone || null }),
        ...(body.address !== undefined && { address: body.address || null }),
        ...(body.description !== undefined && { description: body.description || null }),
        ...(body.status && { status: body.status })
      }
    });

    return NextResponse.json(merchant);
  } catch (error: any) {
    console.error('Error updating merchant:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update merchant' },
      { status: 500 }
    );
  }
}

// DELETE merchant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.merchant.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting merchant:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Merchant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete merchant' },
      { status: 500 }
    );
  }
}