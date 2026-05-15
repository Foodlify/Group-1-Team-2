import { OrderHandler } from "./handler/orderHandler";
import { CartCheckHandler } from "./handler/CartLockCheckHandler";
import { ValidateCustomerExistHandler } from "./handler/ValidateCustomerHandler";
import { validateAddressHandler } from "./handler/ValidateAddressHandler";
import { ItemsAvailabilityCheckHandler } from "./handler/ItemsAvailabilityCheckHandler";
import { FinalizeOrderHandler } from "./handler/FinalizeOrderHandle";
import { PaymentProcessHandler } from "./handler/PaymentProcessHandler";
import { OrderRequest } from "../../types/OrderRequest";
import { OrderResponse } from "../../types/OrderResponse";
import { logger } from "../../config/logger";
import prisma from './../../lib/prisma';

export const createOrder = async (
  request: OrderRequest
): Promise<OrderResponse> => {

  logger.info("Starting order creation process", {
    userId: request.userId,
    cartId: request.cartId,
    PaymentMethod: request.paymentMethod,
  });

  let response: OrderResponse = {} as OrderResponse;

  await prisma.$transaction(async (tx) => {
    request.tx = tx;

    const chain = OrderHandler.processOrder(
      new CartCheckHandler(),
      new ValidateCustomerExistHandler(),
      new validateAddressHandler(),
      new ItemsAvailabilityCheckHandler(),
      new FinalizeOrderHandler(),
    );

    response = await chain.handle(request, {} as OrderResponse);
  });

  await new PaymentProcessHandler().handle(request, response);

  logger.info("Order creation process completed", {
    orderId: response.orderId,
    totalPrice: response.totalPrice,
  });

  return response;
};