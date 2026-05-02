import prisma  from "../../lib/prisma";

export const findAllOrdersByUserId = async (userId: number) => {
    return await prisma.order.findMany({
        where: { customerId: userId },
        include: {
            orderItem: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
};

export const findOrderByIdAndUserId = async (orderId: number, userId: number) => {
    return await prisma.order.findFirst({
        where: { id: orderId, customerId: userId },
        include: {
            orderItem: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
}

