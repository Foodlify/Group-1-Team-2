import { CartStatus, PaymentMethod } from "@prisma/client";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { CardPaymentStrategy } from "../strategy/CardPaymentStrategy";
import { CashPaymentStrategy } from "../strategy/CashPaymentStrategy";
import {PaymentStartegy } from "../strategy/PaymentStrategy.interface";
import { OrderHandler } from "./orderHandler";
import prisma from "../../../lib/prisma";
import { PaymentFailedException } from "../../../shared/exceptions/order.exception";

export class PaymentProcessHandler extends OrderHandler{
  async handle(request: OrderRequest, response: OrderResponse): Promise<OrderResponse> {

    const strategies: Record<PaymentMethod, PaymentStartegy> = {
    CASH: new CashPaymentStrategy(),
    CARD: new CardPaymentStrategy(),
}
    const strategy:PaymentStartegy  = strategies[request.paymentMethod];
    console.log(`Processing payment method: ${request.paymentMethod}`);

    const success = await strategy.processPayment(response);
    
    if (!success) {
      throw new PaymentFailedException();
    }

    await prisma.cart.update({
      where: { id: request.cartId },
      data: { status: CartStatus.COMPLETED },
    });

    return this.handleNext(request, response);
  }
}