import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/api/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Backend API returned:', response.status);
      return NextResponse.json([], { status: response.status });
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products from backend:', error);
    return NextResponse.json([], { status: 500 });
  }
}