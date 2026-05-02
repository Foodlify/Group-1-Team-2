import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SQL seeding...");

  // =========================
  // USERS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (id, name, email)
    VALUES 
      (1, 'John Doe', 'john@test.com'),
      (2, 'Jane Doe', 'jane@test.com')
    ON CONFLICT (email) DO NOTHING;
  `);

  // =========================
  // CUSTOMERS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Customer" (id, "userId")
    VALUES 
      (1, 1),
      (2, 2)
    ON CONFLICT ("userId") DO NOTHING;
  `);

  // =========================
  // RESTAURANTS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Restaurant" (id, name)
    VALUES 
      (1, 'Foodlify')
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // MENUS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Menu" (id, "restaurantId")
    VALUES 
      (1, 1)
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // MENU ITEMS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MenuItem" (id, "menuId", "itemName", price, stock)
    VALUES 
      (1, 1, 'Burger', 10.00, 50),
      (2, 1, 'Pizza', 15.00, 40),
      (3, 1, 'Pasta', 12.00, 30)
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // CARTS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Cart" (id, "customerId", "restaurantId", status, "createdAt")
    VALUES 
      (1, 1, 1, true, NOW()),
      (2, 2, 1, true, NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // CART ITEMS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "CartItem" (id, "cartId", "menuItemId", quantity)
    VALUES 
      (1, 1, 1, 2),
      (2, 1, 2, 1),
      (3, 2, 3, 3)
    ON CONFLICT ("cartId", "menuItemId") DO NOTHING;
  `);

  // =========================
  // ADDRESSES
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Address" (id, "customerId", "addressLine", city, government, "postalCode")
    VALUES 
      (1, 1, 'Nasr City Street 1', 'Cairo', 'Cairo', '11311'),
      (2, 2, 'Dokki Street 5', 'Giza', 'Giza', '12611')
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // ORDERS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Order" (id, "customerId", "restaurantId", "addressId", status, "totalPrice", "paymentMethod", notes, "createdAt")
    VALUES 
      (1, 1, 1, 1, 'PENDING', 25.00, 'CASH', 'Leave at door', NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // ORDER ITEMS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "OrderItem" (id, "orderId", "menuItemId", "itemName", price, quantity, "itemTotal")
    VALUES 
      (1, 1, 1, 'Burger', 10.00, 2, 20.00),
      (2, 1, 2, 'Pizza', 15.00, 1, 15.00)
    ON CONFLICT (id) DO NOTHING;
  `);

  // =========================
  // TRANSACTIONS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Transaction" (id, "orderId", "customerId", "paymentMethod", "paymentStatus", "shippingFee", "totalAmount", currency, "createdAt")
    VALUES 
      (1, 1, 1, 'CASH', 'PENDING', 5.00, 30.00, 'EGP', NOW())
    ON CONFLICT ("orderId") DO NOTHING;
  `);

  // =========================
  // TRANSACTION DETAILS
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "TransactionDetails" (id, "transactionId", provider, "providerTransactionId", status, amount, details)
    VALUES 
      (1, 1, 'PayMob', 'TXN_123456', 'PENDING', 30.00, '{"source":"seed"}')
    ON CONFLICT ("transactionId") DO NOTHING;
  `);

  // =========================
  // TRANSACTION AUDIT
  // =========================
  await prisma.$executeRawUnsafe(`
    INSERT INTO "TransactionAudit" (id, "transactionId", "oldStatus", "newStatus", note, "changedAt")
    VALUES 
      (1, 1, 'PENDING', 'PENDING', 'Seed entry', NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });