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
import * as orderRepo from "./order.repository";
import * as customerRepo from "../customer/customer.repository";
import { OrderNotFoundException } from "../../shared/exceptions/order.exception";
import { CustomerNotFound } from "../../shared/exceptions/Customer.exception";
import { OrderPricingHandler } from "./handler/OrderPricingHandler";


export const createOrder = async (request: OrderRequest): Promise<OrderResponse> => {
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
      new OrderPricingHandler(),
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

export const getAllOrders = async (userId: string) => {
    const customer = await customerRepo.getCustomerProfileByUserId(userId);
    if (!customer) throw new CustomerNotFound(userId);

    return await orderRepo.findAllOrdersByUserId(customer.id);
};

export const getOrderById = async (userId: string, orderId: number) => {
    const customer = await customerRepo.getCustomerProfileByUserId(userId);
    if (!customer) throw new CustomerNotFound(userId);

    const order = await orderRepo.findOrderByIdAndUserId(orderId, customer.id);
    if (!order) {
        throw new OrderNotFoundException();
    }
    return order;
};