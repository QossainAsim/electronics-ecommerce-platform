const prisma = require('../prisma');

// Get all merchants
async function getAllMerchants(request, response) {
  try {
    const merchants = await prisma.merchant.findMany({
      include: {
        products: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    response.json(merchants);
  } catch (error) {
    console.error('Error fetching merchants:', error);
    response.status(500).json({ error: 'Failed to fetch merchants' });
  }
}

// Create merchant
async function createMerchant(request, response) {
  try {
    const { name, email, phone, address, description, status } = request.body;

    if (!name || !email) {
      return response.status(400).json({ error: 'Name and email are required' });
    }

    const merchant = await prisma.merchant.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        description: description || null,
        status: status || 'pending',
      },
    });

    response.status(201).json(merchant);
  } catch (error) {
    console.error('Error creating merchant:', error);
    response.status(500).json({ error: 'Failed to create merchant' });
  }
}

// Get merchant by ID
async function getMerchantById(request, response) {
  try {
    const { id } = request.params;

    const merchant = await prisma.merchant.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!merchant) {
      return response.status(404).json({ error: 'Merchant not found' });
    }

    response.json(merchant);
  } catch (error) {
    console.error('Error fetching merchant:', error);
    response.status(500).json({ error: 'Failed to fetch merchant' });
  }
}

// Update merchant
async function updateMerchant(request, response) {
  try {
    const { id } = request.params;
    const { name, email, phone, address, description, status } = request.body;

    const merchant = await prisma.merchant.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(address !== undefined && { address: address || null }),
        ...(description !== undefined && { description: description || null }),
        ...(status && { status }),
      },
    });

    response.json(merchant);
  } catch (error) {
    console.error('Error updating merchant:', error);
    response.status(500).json({ error: 'Failed to update merchant' });
  }
}

// Delete merchant
async function deleteMerchant(request, response) {
  try {
    const { id } = request.params;

    await prisma.merchant.delete({
      where: { id },
    });

    response.json({ success: true });
  } catch (error) {
    console.error('Error deleting merchant:', error);
    response.status(500).json({ error: 'Failed to delete merchant' });
  }
}

module.exports = {
  getAllMerchants,
  createMerchant,
  getMerchantById,
  updateMerchant,
  deleteMerchant,
};