// test-api.js
const testEmail = "abc@gmail.com"; // ← Paste the real email here

async function testAPI() {
  console.log("🧪 Testing Order API Endpoints...\n");

  try {
    // Test 1: Get all orders
    console.log("1️⃣ Testing GET /api/orders (all orders)");
    const allOrders = await fetch("http://localhost:3001/api/orders");
    const allOrdersData = await allOrders.json();
    console.log(`   ✅ Status: ${allOrders.status}`);
    console.log(`   📦 Total orders in DB: ${allOrdersData.length || 0}\n`);

    // Test 2: Get orders by email
    console.log(`2️⃣ Testing GET /api/orders/user/${testEmail}`);
    const userOrders = await fetch(`http://localhost:3001/api/orders/user/${encodeURIComponent(testEmail)}`);
    const userOrdersData = await userOrders.json();
    console.log(`   ✅ Status: ${userOrders.status}`);
    console.log(`   📧 Orders for ${testEmail}: ${userOrdersData.total || 0}`);
    console.log(`   📦 Response:`, JSON.stringify(userOrdersData, null, 2), "\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();