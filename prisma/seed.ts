import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding with SQL...");

  // ─── USERS ───────────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (id, name, email)
    VALUES
      (1, 'John Doe',   'john@test.com'),
      (2, 'Jane Doe',   'jane@test.com'),
      (3, 'Ali Hassan', 'ali@test.com')
    ON CONFLICT (email) DO NOTHING;
  `);

  // ─── CUSTOMERS ───────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Customer" (id, "userId")
    VALUES
      (1, 1),
      (2, 2),
      (3, 3)
    ON CONFLICT ("userId") DO NOTHING;
  `);

  // ─── RESTAURANTS ─────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Restaurant" (id, name)
    VALUES
      (1, 'Foodlify'),
      (2, 'Pizza Palace')
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── MENUS ───────────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Menu" (id, "restaurantId")
    VALUES
      (1, 1),
      (2, 2)
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── MENU ITEMS ──────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MenuItem" (id, "menuId", "itemName", price, stock)
    VALUES
      (1, 1, 'Burger',        10.00, 50),
      (2, 1, 'Pizza',         15.00, 40),
      (3, 1, 'Pasta',         12.00, 30),
      (4, 2, 'Margherita',    18.00, 25),
      (5, 2, 'Pepperoni',     20.00, 20),
      (6, 2, 'Garlic Bread',   5.00, 60)
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── ADDRESSES ───────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Address" (id, "customerId", "addressLine", city, government, "postalCode")
    VALUES
      (1, 1, '12 Tahrir Square',    'Cairo',       'Cairo',    '11511'),
      (2, 1, '5 Corniche El Nil',   'Giza',        'Giza',     '12511'),
      (3, 2, '88 El Nasr Road',     'Cairo',       'Cairo',    '11765'),
      (4, 3, '3 Port Said Street',  'Alexandria',  'Alex',     '21519')
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── CARTS ───────────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Cart" (id, "customerId", "restaurantId", status, "createdAt")
    VALUES
      (1, 1, 1, true,  NOW()),
      (2, 2, 1, true,  NOW()),
      (3, 3, 2, false, NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── CART ITEMS ──────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "CartItem" ("cartId", "menuItemId", quantity)
    VALUES
      (1, 1, 2),
      (1, 2, 1),
      (2, 3, 3),
      (3, 4, 1),
      (3, 6, 2)
    ON CONFLICT ("cartId", "menuItemId") DO NOTHING;
  `);

  // ─── ORDERS ──────────────────────────────────────────────────────────────
  // Order 1: John – Foodlify – DELIVERED – CARD
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Order" (id, "customerId", "restaurantId", "addressId", status, "totalPrice", "paymentMethod", notes, "createdAt")
    VALUES
      (1, 1, 1, 1, 'DELIVERED', 35.00, 'CARD',   'Extra ketchup please',  NOW() - INTERVAL '3 days'),
      (2, 1, 1, 2, 'PENDING',   24.00, 'CASH',    NULL,                   NOW() - INTERVAL '1 hour'),
      (3, 2, 1, 3, 'PREPARING', 36.00, 'WALLET',  'No onions',            NOW() - INTERVAL '30 minutes'),
      (4, 3, 2, 4, 'CANCELLED', 43.00, 'APPLE_PAY','Urgent order',        NOW() - INTERVAL '2 days'),
      (5, 2, 2, 3, 'PENDING',   25.00, 'CARD',    NULL,                   NOW() - INTERVAL '5 minutes')
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── ORDER ITEMS ─────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "OrderItem" (id, "orderId", "menuItemId", "itemName", price, quantity, "itemTotal")
    VALUES
      -- Order 1: Burger x2 + Pizza x1
      (1,  1, 1, 'Burger', 10.00, 2, 20.00),
      (2,  1, 2, 'Pizza',  15.00, 1, 15.00),
      -- Order 2: Pasta x2
      (3,  2, 3, 'Pasta',  12.00, 2, 24.00),
      -- Order 3: Pasta x3
      (4,  3, 3, 'Pasta',  12.00, 3, 36.00),
      -- Order 4: Margherita x1 + Pepperoni x1 + Garlic Bread x1
      (5,  4, 4, 'Margherita',  18.00, 1, 18.00),
      (6,  4, 5, 'Pepperoni',   20.00, 1, 20.00),
      (7,  4, 6, 'Garlic Bread', 5.00, 1,  5.00),
      -- Order 5: Pepperoni x1 + Garlic Bread x1
      (8,  5, 5, 'Pepperoni',   20.00, 1, 20.00),
      (9,  5, 6, 'Garlic Bread', 5.00, 1,  5.00)
    ON CONFLICT (id) DO NOTHING;
  `);

  // ─── TRANSACTIONS ────────────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Transaction" (id, "orderId", "customerId", "paymentMethod", "paymentStatus", "shippingFee", "totalAmount", currency, "createdAt")
    VALUES
      (1, 1, 1, 'CARD',      'PAID',    5.00, 40.00, 'EGP', NOW() - INTERVAL '3 days'),
      (2, 2, 1, 'CASH',      'PENDING', 5.00, 29.00, 'EGP', NOW() - INTERVAL '1 hour'),
      (3, 3, 2, 'WALLET',    'PENDING', 5.00, 41.00, 'EGP', NOW() - INTERVAL '30 minutes'),
      (4, 4, 3, 'APPLE_PAY', 'REFUNDED',5.00, 48.00, 'EGP', NOW() - INTERVAL '2 days'),
      (5, 5, 2, 'CARD',      'PENDING', 5.00, 30.00, 'EGP', NOW() - INTERVAL '5 minutes')
    ON CONFLICT ("orderId") DO NOTHING;
  `);

  // ─── TRANSACTION DETAILS ─────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "TransactionDetails" (id, "transactionId", provider, "providerTransactionId", status, amount, details)
    VALUES
      (1, 1, 'Stripe',  'stripe_txn_001', 'SUCCESS', 40.00, '{"charge_id": "ch_001", "last4": "4242"}'),
      (2, 4, 'PayMob',  'paymob_txn_004', 'FAILED',  48.00, '{"error": "insufficient_funds"}')
    ON CONFLICT ("transactionId") DO NOTHING;
  `);

  // ─── TRANSACTION AUDIT ───────────────────────────────────────────────────
  await prisma.$executeRawUnsafe(`
    INSERT INTO "TransactionAudit" (id, "transactionId", "oldStatus", "newStatus", note, "changedAt")
    VALUES
      (1, 1, 'PENDING', 'PAID',     'Payment confirmed by Stripe',     NOW() - INTERVAL '3 days'),
      (2, 4, 'PENDING', 'FAILED',   'Insufficient funds via PayMob',   NOW() - INTERVAL '2 days'),
      (3, 4, 'FAILED',  'REFUNDED', 'Auto-refund triggered after fail', NOW() - INTERVAL '2 days' + INTERVAL '1 hour')
    ON CONFLICT (id) DO NOTHING;
  `);

  console.log("✅ SQL seeding completed");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });