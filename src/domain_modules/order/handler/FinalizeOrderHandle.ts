import prisma from "../../../lib/prisma";
import { logger } from "../../../config/logger";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import * as orderRepo from "../order.repository";
import * as transactionRepo from "../../transaction/transaction.repostiory";

export class FinalizeOrderHandler extends OrderHandler {
  async handle(
    request: OrderRequest,
    response: OrderResponse
  ): Promise<OrderResponse> {
    const client = request.tx ?? prisma;


    const orderData = {
      customerId: response.customerId,
      restaurantId: response.restaurantId,
      addressId: response.addressId,
      phone: request.phone,
      notes: request.notes,
      paymentMethod: request.paymentMethod,
      totalPrice: response.totalPrice,
    };

    const order = await orderRepo.createOrder(orderData, client);

    const transactionData = {
      orderId: order.id,
      customerId: response.customerId,
      paymentMethod: request.paymentMethod,
      shippingFee: 10,
      totalAmount: response.totalPrice,
    };

    await Promise.all([
      orderRepo.createOrderItems(response.orderItems, order.id, client),
      transactionRepo.createTransaction(transactionData, client),
    ]);

    response.orderId = order.id;

    logger.info("Order finalized successfully", {
      orderId: order.id,
      customerId: response.customerId,
      totalPrice: response.totalPrice,
      paymentMethod: request.paymentMethod,
    });

    return this.handleNext(request, response);
  }
}