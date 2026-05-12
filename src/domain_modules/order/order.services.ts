
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


export const createOrder = async (
  request: OrderRequest
): Promise<OrderResponse> => {
  const chain = OrderHandler.processOrder(
    new CartCheckHandler(),
    new ValidateCustomerExistHandler(),
    new validateAddressHandler(),
    new ItemsAvailabilityCheckHandler(),
    new FinalizeOrderHandler(),
    new PaymentProcessHandler()
  );

  logger.info("Starting order creation process", {
    userId: request.userId,
    cartId: request.cartId,
    PaymentMethod: request.paymentMethod,
  });

  const response = await chain.handle(request, {} as OrderResponse);

  logger.info("Order creation process completed", {
    orderId: response.orderId,
    totalPrice: response.totalPrice,
  });

  return response;
};
