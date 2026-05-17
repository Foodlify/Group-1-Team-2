import prisma from "../../lib/prisma";

export const markOrderAsPaid = async (orderId: number) => {
    await prisma.$transaction(async (tx) => {
        
        const order = await tx.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                orderItems: true
            }
        });

        if (!order) throw new Error("Order not found");

        // 2- update order
        await tx.order.update({
            where: { id: Number(orderId) },
            data: {
                paymentStatus: "PAID",
                status: "CONFIRMED",
                paidAt: new Date(),
            },
        });

        // 3- update transaction
        await tx.transaction.update({
            where: { orderId: Number(orderId) },
            data: {
                paymentStatus: "PAID"
            }
        });

        // 4- complete cart (optional best practice)
        await tx.cart.updateMany({
            where: {
                customerId: order.customerId,
                restaurantId: order.restaurantId,
                status: "LOCKED"
            },
            data: {
                status: "COMPLETED"
            }
        });

    });
};


export const markOrderAsPaymentFailed = async (orderId: number) => {

    await prisma.$transaction(async (tx) => {

        const order = await tx.order.findUnique({
            where: { id: Number(orderId) },
            include: {
                orderItems: true
            }
        });

        if (!order) throw new Error("Order not found");

        // 1- prevent double rollback (idempotency)
        if (order.paymentStatus === "FAILED") return;

        // 2- restore inventory
        for (const item of order.orderItems) {
            await tx.menuItem.update({
                where: { id: item.menuItemId },
                data: {
                    stock: {
                        increment: item.quantity
                    }
                }
            });
        }
        // 3- update order
        await tx.order.update({
            where: { id: Number(orderId) },
            data: {
                paymentStatus: "FAILED",
                status: "FAILED"
            },
        });

        // 4- update transaction
        await tx.transaction.update({
            where: { orderId: Number(orderId) },
            data: {
                paymentStatus: "FAILED"
            }
        });

        // 5- unlock cart (NO schema change needed)
        await tx.cart.updateMany({
            where: {
                customerId: order.customerId,
                restaurantId: order.restaurantId,
                status: "LOCKED"
            },
            data: {
                status: "ACTIVE"
            }
        });

    });
};