import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all merchants
export async function GET() {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        products: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(merchants);
  } catch (error: any) {
    console.error('Error fetching merchants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchants' },
      { status: 500 }
    );
  }
}

// POST create merchant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const merchant = await prisma.merchant.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        address: body.address || null,
        description: body.description || null,
        status: body.status || 'pending'
      }
    });

    return NextResponse.json(merchant, { status: 201 });
  } catch (error: any) {
    console.error('Error creating merchant:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create merchant' },
      { status: 500 }
    );
  }
}