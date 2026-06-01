
import prisma from "../../lib/prisma"
import { DBClient } from "../../types/PrismaClientOrTx";

export const getCustomerProfileByUserId = async (userId: number , client:DBClient = prisma) => {
  return await client.customer.findUnique({
    where: { userId },
    include: {
      user: {
        select: { name: true, email: true },
      },
      order: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          totalPrice: true,
          createdAt: true,
        },
      },
      _count: {
        select: { order: true },
      },
    },
  });
};
    

export const updateUser = async (id: number, data: any) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};