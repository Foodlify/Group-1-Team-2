import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding with SQL...");

  // USERS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (id, name, email)
    VALUES
      (1, 'John Doe', 'john@test.com'),
      (2, 'Jane Doe', 'jane@test.com')
    ON CONFLICT (email) DO NOTHING;
  `);

  // CUSTOMERS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Customer" (id, "userId")
    VALUES
      (1, 1),
      (2, 2)
    ON CONFLICT ("userId") DO NOTHING;
  `);

  // RESTAURANT
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Restaurant" (id, name)
    VALUES
      (1, 'Foodlify')
    ON CONFLICT (id) DO NOTHING;
  `);

  // MENU
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Menu" (id, "restaurantId")
    VALUES
      (1, 1)
    ON CONFLICT (id) DO NOTHING;
  `);

  // MENU ITEMS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "MenuItem" (id, "menuId", "itemName", price, stock)
    VALUES
      (1, 1, 'Burger', 10.00, 50),
      (2, 1, 'Pizza', 15.00, 40),
      (3, 1, 'Pasta', 12.00, 30)
    ON CONFLICT (id) DO NOTHING;
  `);

  // CARTS ✅ (تم تصحيح status بدل isActive)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Cart" (id, "customerId", "restaurantId", status, "createdAt")
    VALUES
      (1, 1, 1, true, NOW()),
      (2, 2, 1, true, NOW())
    ON CONFLICT (id) DO NOTHING;
  `);

  // CART ITEMS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "CartItem" ("cartId", "menuItemId", quantity)
    VALUES
      (1, 1, 2),
      (1, 2, 1),
      (2, 3, 3)
    ON CONFLICT ("cartId", "menuItemId") DO NOTHING;
  `);


  await prisma.$executeRawUnsafe(`SELECT setval('"Cart_id_seq"', (SELECT MAX(id) FROM "Cart"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"CartItem_id_seq"', (SELECT MAX(id) FROM "CartItem"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', (SELECT MAX(id) FROM "User"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Customer_id_seq"', (SELECT MAX(id) FROM "Customer"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Restaurant_id_seq"', (SELECT MAX(id) FROM "Restaurant"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"Menu_id_seq"', (SELECT MAX(id) FROM "Menu"))`);
  await prisma.$executeRawUnsafe(`SELECT setval('"MenuItem_id_seq"', (SELECT MAX(id) FROM "MenuItem"))`);
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

  