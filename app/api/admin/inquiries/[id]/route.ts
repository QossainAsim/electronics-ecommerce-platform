import { NextResponse } from "next/server";
import prisma from "@/utils/db";

// PATCH update inquiry status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();

    if (!status || !["pending", "responded", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json({ inquiry });
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}