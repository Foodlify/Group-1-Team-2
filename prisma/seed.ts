import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Users — بنستخدم create مش createMany عشان نمسك الـ id اللي اتولد (uuid)
  const john = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@test.com",
      password: passwordHash,
      role: "CUSTOMER",
      phone: "01154467412",
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@test.com",
      password: passwordHash,
      role: "CUSTOMER",
      phone: "01094977673",
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      name: "Restaurant Owner",
      email: "owner@test.com",
      password: passwordHash,
      role: "OWNER",
      phone: "01012345678",
    },
  });

  // Customers — userId دلوقتي بياخد الـ uuid الحقيقي اللي اتولد فوق
  await prisma.customer.createMany({
    data: [
      { id: 1, userId: john.id },
      { id: 2, userId: jane.id },
    ],
    skipDuplicates: true,
  });

  // Owner
  await prisma.owner.createMany({
    data: [{ id: 1, userId: ownerUser.id }],
    skipDuplicates: true,
  });

  // Restaurant — Owner.id لسه Int زي ما هو، فمحتاجش أي تغيير هنا
  await prisma.restaurant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Foodlify",
      ownerId: 1,
    },
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
      { id: 1, customerId: 1, restaurantId: 1, status: "ACTIVE" },
      { id: 2, customerId: 2, restaurantId: 1, status: "ACTIVE" },
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