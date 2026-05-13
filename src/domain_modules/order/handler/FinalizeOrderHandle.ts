import prisma from "../../../lib/prisma";
import { CartStatus, PaymentMethod } from "@prisma/client";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import { logger } from "../../../config/logger";

export class FinalizeOrderHandler extends OrderHandler {
  async handle(
    request: OrderRequest,
    response: OrderResponse
  ): Promise<OrderResponse> {
    const order = await prisma.order.create({
      data: {
         customer:   { connect: { id: response.customerId! } },
         restaurant: { connect: { id: response.restaurantId! } },
         address:    { connect: { id: request.addressId! } },
        phone: request.phone,
        notes: request.notes,
        paymentMethod: request.paymentMethod,
        totalPrice: response.totalPrice!,
      },
    });

    await prisma.orderItem.createMany({
      data: response.orderItems.map((item) => ({ ...item, orderId: order.id })),
    });

    await prisma.transaction.create({
      data: {
        orderId: order.id,
        customerId: response.customerId,
        paymentMethod: request.paymentMethod,
        shippingFee: 10,
        totalAmount: response.totalPrice,
      },
    });

    await prisma.cart.update({
      where: { id: request.cartId },
      data: { status: CartStatus.COMPLETED },
    });

    response.orderId = order.id;

    logger.info("Order finalized successfully", {
      orderId: order.id,
      customerId: response.customerId,
      totalPrice: response.totalPrice,
      PaymentMethod: request.paymentMethod,
    });
    return this.handleNext(request, response);
  }
}
