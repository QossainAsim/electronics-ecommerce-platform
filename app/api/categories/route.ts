import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all categories (INCLUDING subcategories)
export async function GET() {
  try {
    // ✅ FETCH ALL CATEGORIES (parents AND children)
    const categories = await prisma.category.findMany({
      // ❌ REMOVED: where: { parentId: null }
      // Now fetches ALL categories regardless of parent status
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        children: {
          orderBy: { name: 'asc' }
        },
        _count: {
          select: {
            products: true,
            children: true  // ✅ Added: count of subcategories
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        icon: body.icon || null,
        image: body.image || null,
        parentId: body.parentId || null
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        children: true,
        _count: {
          select: { 
            products: true,
            children: true
          }
        }
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Category with this name or slug already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    );
  }
}