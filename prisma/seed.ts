import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding with SQL...");

  await prisma.$executeRawUnsafe(`
    INSERT INTO "User" (id, name, email)
    VALUES
      (1, 'John Doe', 'john@test.com'),
      (2, 'Jane Doe', 'jane@test.com')
    ON CONFLICT (id) DO NOTHING;
  `);

  // CUSTOMERS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Customer" (id, "userId")
    VALUES
      (1, 1),
      (2, 2)
    ON CONFLICT (id) DO NOTHING;
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
    INSERT INTO "MenuItem" (id, "menuId", "itemName", price)
    VALUES
      (1, 1, 'Burger', 10.00),
      (2, 1, 'Pizza', 15.00),
      (3, 1, 'Pasta', 12.00)
    ON CONFLICT (id) DO NOTHING;
  `);

  // CARTS
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Cart" (id, "customerId", "restaurantId", "isActive", "createdAt")
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
  
    console.log("SQL seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });