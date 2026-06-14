import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Users
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: "John Doe",
        email: "john@test.com",
        password: passwordHash,
        role: "CUSTOMER",
        phone: "01154467412",
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@test.com",
        password: passwordHash,
        role: "CUSTOMER",
        phone: "01094977673",
      },
      {
        id: 3,
        name: "Restaurant Owner",
        email: "owner@test.com",
        password: passwordHash,
        role: "OWNER",
        phone: "01012345678",
      },
    ],
    skipDuplicates: true,
  });

  // Customers
  await prisma.customer.createMany({
    data: [
      { id: 1, userId: 1 },
      { id: 2, userId: 2 },
    ],
    skipDuplicates: true,
  });

  // Owner
  await prisma.owner.createMany({
    data: [
      {
        id: 1,
        userId: 3,
      },
    ],
    skipDuplicates: true,
  });

  // Restaurant
  await prisma.restaurant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Foodlify",
      ownerId: 1,
    }as any,
  });

  // Menu
  await prisma.menu.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      restaurantId: 1,
    },
  });

  // Menu Items
  await prisma.menuItem.createMany({
    data: [
      { id: 1, menuId: 1, itemName: "Burger", price: 10, stock: 50 },
      { id: 2, menuId: 1, itemName: "Pizza", price: 15, stock: 40 },
      { id: 3, menuId: 1, itemName: "Pasta", price: 12, stock: 30 },
    ],
    skipDuplicates: true,
  });

  // Carts
  await prisma.cart.createMany({
    data: [
      {
        id: 1,
        customerId: 1,
        restaurantId: 1,
        status: "ACTIVE",
      },
      {
        id: 2,
        customerId: 2,
        restaurantId: 1,
        status: "ACTIVE",
      },
    ],
    skipDuplicates: true,
  });

  // Cart Items
  await prisma.cartItem.createMany({
    data: [
      { cartId: 1, menuItemId: 1, quantity: 2 },
      { cartId: 1, menuItemId: 2, quantity: 1 },
      { cartId: 2, menuItemId: 3, quantity: 3 },
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