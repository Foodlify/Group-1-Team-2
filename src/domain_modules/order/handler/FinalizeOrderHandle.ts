import prisma from "../../../lib/prisma";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";
import { logger } from "../../../config/logger";
import * as orderRepo from "../order.repository";
import * as transactionRepo from "../../transaction/transaction.repostiory";

export class FinalizeOrderHandler extends OrderHandler {
  async handle(
    request: OrderRequest,
    response: OrderResponse
  ): Promise<OrderResponse> {


const orderData = {
  customerId: response.customerId,
  restaurantId: response.restaurantId,
  addressId: request.addressId,
  phone: request.phone,
  notes: request.notes,
  paymentMethod: request.paymentMethod,
  totalPrice: response.totalPrice,
}

    const order = await orderRepo.createOrder(orderData, request.tx);

    await orderRepo.createOrderItems(
    response.orderItems,
    order.id,
    request.tx
  );

  const transactionData = {
        orderId: order.id,
        customerId: response.customerId,
        paymentMethod: request.paymentMethod,
        shippingFee: 10,
        totalAmount: response.totalPrice,
      };

    await transactionRepo.createTransaction(transactionData, request.tx);


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
