const prisma = require("../utills/db"); // ✅ Use shared connection

async function getProductBySlug(request, response) {
  const { slug } = request.params;
  const product = await prisma.product.findMany({
    where: {
      slug: slug,
    },
    include: {
      category: true,
      // ✅ FIXED: Only include active, non-expired deals
      deal: {
        where: {
          isActive: true,
          endDate: { gte: new Date() }
        },
        select: {
          id: true,
          productId: true,
          discountPercent: true,
          startDate: true,
          endDate: true,
          isActive: true,
        }
      }
    },
  });

  const foundProduct = product[0]; // Assuming there's only one product with that slug
  if (!foundProduct) {
    return response.status(404).json({ error: "Product not found" });
  }
  return response.status(200).json(foundProduct);
}

module.exports = { getProductBySlug };