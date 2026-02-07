import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/api/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 500 });
    }

    const products = await response.json();

    // In-stock only + random 4
    const hotSelling = products
      .filter((p: any) => p.inStock > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    return NextResponse.json(hotSelling);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
