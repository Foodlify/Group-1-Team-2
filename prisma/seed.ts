import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // USERS + CUSTOMERS
  // =========================
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "abdullahsaidfawzy@gmail.com",
        password: passwordHash,
        role: "CUSTOMER",
        phone:"01154467412"
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@test.com",
        password: passwordHash,
        role: "CUSTOMER",
         phone:"01094977673"
      }
    ],
    skipDuplicates: true,
  });

  await prisma.customer.createMany({
    data: [
      { id: 1, userId: 1 },
      { id: 2, userId: 2 }
    ],
    skipDuplicates: true,
  });

  // =========================
  // RESTAURANT
  // =========================
  await prisma.restaurant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Foodlify"
    }
  });

  // =========================
  // MENU
  // =========================
  await prisma.menu.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      restaurantId: 1
    }
  });

  // =========================
  // MENU ITEMS
  // =========================
  await prisma.menuItem.createMany({
    data: [
      { id: 1, menuId: 1, itemName: "Burger", price: 10.00, stock: 50 },
      { id: 2, menuId: 1, itemName: "Pizza", price: 15.00, stock: 40 },
      { id: 3, menuId: 1, itemName: "Pasta", price: 12.00, stock: 30 }
    ],
    skipDuplicates: true,
  });

  // =========================
  // CARTS
  // =========================
  await prisma.cart.createMany({
    data: [
      {
        id: 1,
        customerId: 1,
        restaurantId: 1,
        status: "ACTIVE",
        createdAt: new Date(),
      },
      {
        id: 2,
        customerId: 2,
        restaurantId: 1,
        status: "ACTIVE",
        createdAt: new Date(),
      }
    ],
    skipDuplicates: true,
  });

  // =========================
  // CART ITEMS
  // =========================
  await prisma.cartItem.createMany({
    data: [
      { cartId: 1, menuItemId: 1, quantity: 2 },
      { cartId: 1, menuItemId: 2, quantity: 1 },
      { cartId: 2, menuItemId: 3, quantity: 3 }
    ],
    skipDuplicates: true,
  });

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