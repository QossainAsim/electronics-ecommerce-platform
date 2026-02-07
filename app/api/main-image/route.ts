import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("uploadedFile") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename - remove spaces and special characters
    const sanitizedName = file.name
      .replace(/\s+/g, "_") // Replace spaces with underscores
      .replace(/[()]/g, "") // Remove parentheses
      .replace(/[^a-zA-Z0-9._-]/g, ""); // Remove other special chars

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `${timestamp}_${sanitizedName}`;

    // Save directly to /public folder (as you have other images there)
    const publicDir = join(process.cwd(), "public");
    
    // Make sure public directory exists
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    // Save file
    const filepath = join(publicDir, filename);
    await writeFile(filepath, buffer);

    console.log("✅ Image saved:", filename);

    // Return just the filename (no leading slash)
    // Your code uses `/${product.mainImage}` so we return without slash
    return NextResponse.json({
      success: true,
      filename: filename,
      url: filename, // Just the filename
    });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// Increase body size limit
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};