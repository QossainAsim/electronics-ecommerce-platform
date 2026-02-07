// list-emails.js - Run this to see all emails in your orders
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listEmails() {
  console.log("📧 Fetching all emails from orders...\n");

  try {
    const orders = await prisma.customer_order.findMany({
      select: {
        email: true,
        firstName: true,
        lastName: true,
        dateTime: true,
      },
      orderBy: {
        dateTime: 'desc'
      }
    });

    if (orders.length === 0) {
      console.log("No orders found in database.");
      return;
    }

    console.log(`Found ${orders.length} orders:\n`);

    // Get unique emails
    const uniqueEmails = [...new Set(orders.map(o => o.email))];

    console.log("📋 Unique Emails in Database:");
    console.log("================================");
    uniqueEmails.forEach((email, index) => {
      const orderCount = orders.filter(o => o.email === email).length;
      console.log(`${index + 1}. ${email} (${orderCount} orders)`);
    });
    console.log("================================\n");

    console.log("📦 Recent Orders:");
    console.log("================================");
    orders.slice(0, 5).forEach((order, index) => {
      console.log(`${index + 1}. ${order.email} - ${order.firstName} ${order.lastName} (${new Date(order.dateTime).toLocaleDateString()})`);
    });
    console.log("================================\n");

    console.log("💡 Copy one of these emails and use it in test-api.js");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listEmails();