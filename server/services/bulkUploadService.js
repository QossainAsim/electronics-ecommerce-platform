// *********************
// Enhanced Bulk Upload Service - Keeps existing logic + adds Excel, Multiple Images, Local Paths
// *********************

const { parse } = require("csv-parse/sync");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs").promises;

// ============================================
// EXISTING: Validate a single CSV row
// ============================================
function validateRow(row) {
  const errs = [];
  const clean = {};

  const title = String(row.title ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  const price = Number(row.price);
  const categoryId = String(row.categoryId ?? "").trim();
  const inStock = Number(row.inStock ?? 0);

  if (!title) errs.push("title is required");
  if (!slug) errs.push("slug is required");
  if (!Number.isFinite(price) || price < 0)
    errs.push("price must be a non-negative number");
  if (!categoryId) errs.push("categoryId is required");
  if (!Number.isFinite(inStock) || inStock < 0)
    errs.push("inStock must be a non-negative number");

  if (errs.length) return { ok: false, error: errs.join(", ") };

  clean.title = title;
  clean.slug = slug;
  clean.price = Math.round(price * 100) / 100;
  clean.categoryId = categoryId;
  clean.inStock = Math.floor(inStock);

  clean.manufacturer = row.manufacturer
    ? String(row.manufacturer).trim()
    : null;
  clean.description = row.description ? String(row.description).trim() : null;
  clean.mainImage = row.mainImage ? String(row.mainImage).trim() : null;

  return { ok: true, data: clean };
}

// ============================================
// EXISTING: Parse CSV Buffer
// ============================================
async function parseCsvBufferToRows(buffer) {
  const text = buffer.toString("utf-8");
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records;
}

// ============================================
// NEW: Parse Excel Buffer
// ============================================
async function parseExcelBufferToRows(buffer) {
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rows || rows.length === 0) {
      throw new Error("Excel file has no data rows");
    }

    return rows;
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

// ============================================
// NEW: Check if string is a valid URL
// ============================================
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// ============================================
// NEW: Check if string is a local file path
// ============================================
function isLocalPath(string) {
  if (!string || typeof string !== "string") return false;
  const trimmed = string.trim();

  // Windows paths: C:\, D:\, \\network
  if (/^[a-zA-Z]:\\/.test(trimmed) || /^\\\\/.test(trimmed)) {
    return true;
  }

  // Unix/Mac paths: /, ~/, ./
  if (/^[\/~.]/.test(trimmed)) {
    return true;
  }

  return false;
}

// ============================================
// NEW: Process single image source (URL or local path)
// ============================================
async function processImageSource(source, uploadDir) {
  const trimmedSrc = source.trim();

  // If it's a URL, return as-is
  if (isValidUrl(trimmedSrc)) {
    return trimmedSrc;
  }

  // If it's a local path, copy file to server
  if (isLocalPath(trimmedSrc)) {
    try {
      // Check if file exists
      await fs.access(trimmedSrc);

      // Generate unique filename
      const ext = path.extname(trimmedSrc);
      const uniqueName = `product-${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}${ext}`;
      const destPath = path.join(uploadDir, uniqueName);

      // Copy file
      await fs.copyFile(trimmedSrc, destPath);

      // Return server path (relative URL)
      return `/uploads/${uniqueName}`;
    } catch (error) {
      throw new Error(`Cannot access local file: ${trimmedSrc}`);
    }
  }

  // If neither URL nor path, might be empty or invalid
  if (!trimmedSrc) {
    return null;
  }

  throw new Error(`Invalid image source: ${trimmedSrc}`);
}

// ============================================
// NEW: Process multiple images (pipe or comma separated)
// ============================================
async function processMultipleImages(imagesString, uploadDir) {
  if (!imagesString || typeof imagesString !== "string") {
    return { mainImage: null, additionalImages: [] };
  }

  // Split by pipe | or comma ,
  const separator = imagesString.includes("|") ? "|" : ",";
  const imageSources = imagesString
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);

  const processedImages = [];

  for (const source of imageSources) {
    try {
      const processedUrl = await processImageSource(source, uploadDir);
      if (processedUrl) {
        processedImages.push(processedUrl);
      }
    } catch (error) {
      console.error(`Failed to process image ${source}:`, error.message);
      throw error; // Re-throw to mark row as failed
    }
  }

  return {
    mainImage: processedImages.length > 0 ? processedImages[0] : null,
    additionalImages: processedImages.slice(1),
  };
}

// ============================================
// EXISTING: Compute batch status
// ============================================
function computeBatchStatus(successCount, errorCount) {
  if (successCount > 0 && errorCount === 0) return "COMPLETED";
  if (successCount > 0 && errorCount > 0) return "PARTIAL";
  if (successCount === 0 && errorCount > 0) return "FAILED";
  return "PENDING";
}

// ============================================
// ENHANCED: Create products + items (with image support)
// ============================================
async function createBatchWithItems(tx, batchId, validRows, errorRows, uploadDir) {
  const uniqueCategoryIds = [...new Set(validRows.map((r) => r.categoryId))];

  // Fetch categories by both ID and name (case-insensitive)
  const categories = await tx.category.findMany({
    where: {
      OR: [
        { id: { in: uniqueCategoryIds } },
        { name: { in: uniqueCategoryIds } },
      ],
    },
    select: { id: true, name: true },
  });

  // Create a map for both ID and name lookup
  const categoryMap = new Map();
  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat.id);
    categoryMap.set(cat.name.toLowerCase(), cat.id);
  });

  let success = 0;
  let failed = 0;

  for (const row of validRows) {
    // Resolve category ID
    const resolvedCategoryId =
      categoryMap.get(row.categoryId) ||
      categoryMap.get(row.categoryId.toLowerCase());

    if (!resolvedCategoryId) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: `Category not found: ${row.categoryId}`,
        },
      });
      failed++;
      continue;
    }

    try {
      // Process images if provided (supports multiple images)
      let mainImageUrl = row.mainImage || "";
      let additionalImages = [];

      if (row.images) {
        const { mainImage, additionalImages: addImages } = await processMultipleImages(
          row.images,
          uploadDir
        );
        mainImageUrl = mainImage || mainImageUrl;
        additionalImages = addImages;
      } else if (row.mainImage) {
        // Single image in mainImage field (process if local path)
        if (isLocalPath(row.mainImage)) {
          mainImageUrl = await processImageSource(row.mainImage, uploadDir);
        }
      }

      // Create product
      const product = await tx.product.create({
        data: {
          title: row.title,
          slug: row.slug,
          price: row.price,
          rating: 5,
          description: row.description ?? "",
          manufacturer: row.manufacturer ?? "",
          mainImage: mainImageUrl,
          categoryId: resolvedCategoryId,
          inStock: row.inStock,
        },
      });

      // Create additional images if any
      if (additionalImages.length > 0) {
        const imageData = additionalImages.map((imgUrl) => ({
          productID: product.id,
          image: imgUrl,
        }));

        await tx.image.createMany({
          data: imageData,
        });
      }

      // Create bulk upload item
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          productId: product.id,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: mainImageUrl,
          categoryId: resolvedCategoryId,
          inStock: row.inStock,
          status: "CREATED",
          error: null,
        },
      });
      success++;
    } catch (e) {
      await tx.bulk_upload_item.create({
        data: {
          batchId,
          title: row.title,
          slug: row.slug,
          price: row.price,
          manufacturer: row.manufacturer,
          description: row.description,
          mainImage: row.mainImage,
          categoryId: resolvedCategoryId || row.categoryId,
          inStock: row.inStock,
          status: "ERROR",
          error: e?.message || "Create failed",
        },
      });
      failed++;
    }
  }

  // Handle error rows
  for (const err of errorRows) {
    await tx.bulk_upload_item.create({
      data: {
        batchId,
        title: "",
        slug: "",
        price: 0,
        manufacturer: null,
        description: null,
        mainImage: null,
        categoryId: "",
        inStock: 0,
        status: "ERROR",
        error: `Row ${err.index}: ${err.error}`,
      },
    });
    failed++;
  }

  return { successCount: success, errorCount: failed };
}

// ============================================
// EXISTING: Get batch summary
// ============================================
async function getBatchSummary(prisma, batchId) {
  const total = await prisma.bulk_upload_item.count({ where: { batchId } });
  const errors = await prisma.bulk_upload_item.count({
    where: { batchId, status: "ERROR" },
  });
  const created = await prisma.bulk_upload_item.count({
    where: { batchId, status: "CREATED" },
  });
  const updated = await prisma.bulk_upload_item.count({
    where: { batchId, status: "UPDATED" },
  });
  return { total, errors, created, updated };
}

// ============================================
// EXISTING: Check if products can be deleted
// ============================================
async function canDeleteProductsForBatch(prisma, batchId) {
  const items = await prisma.bulk_upload_item.findMany({
    where: { batchId, productId: { not: null } },
    select: { productId: true },
  });
  const productIds = items.map((i) => i.productId).filter(Boolean);

  if (productIds.length === 0) {
    return { canDelete: true, blockedProductIds: [] };
  }

  const referenced = await prisma.customer_order_product.findMany({
    where: { productId: { in: productIds } },
    select: { productId: true },
  });

  const blocked = new Set(referenced.map((r) => r.productId));
  const blockedList = productIds.filter((id) => blocked.has(id));

  if (blockedList.length > 0) {
    return {
      canDelete: false,
      reason: "Some products are in orders",
      blockedProductIds: blockedList,
    };
  }

  return { canDelete: true, blockedProductIds: [] };
}

// ============================================
// EXISTING: Apply item updates
// ============================================
async function applyItemUpdates(tx, batchId, updates) {
  const ids = updates.map((u) => u.itemId);
  const items = await tx.bulk_upload_item.findMany({
    where: { id: { in: ids }, batchId },
    select: { id: true, productId: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));
  const result = [];

  for (const upd of updates) {
    const current = byId.get(upd.itemId);
    if (!current) continue;

    const price = Math.round(Number(upd.price));
    const inStock = Number(upd.inStock) === 1 ? 1 : 0;

    if (current.productId) {
      await tx.product.update({
        where: { id: current.productId },
        data: { price, inStock },
      });
    }

    const updatedItem = await tx.bulk_upload_item.update({
      where: { id: upd.itemId },
      data: { price, inStock, status: "UPDATED", error: null },
    });
    result.push(updatedItem);
  }
  return result;
}

// ============================================
// EXPORTS
// ============================================
module.exports = {
  parseCsvBufferToRows,
  parseExcelBufferToRows, // NEW
  validateRow,
  createBatchWithItems,
  computeBatchStatus,
  getBatchSummary,
  canDeleteProductsForBatch,
  applyItemUpdates,
  processMultipleImages, // NEW
  isValidUrl, // NEW
  isLocalPath, // NEW
};