
import prisma from "../../lib/prisma"

export const getCustomerProfileByUserId = async (userId: number) => {
  return await prisma.customer.findUnique({
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
    