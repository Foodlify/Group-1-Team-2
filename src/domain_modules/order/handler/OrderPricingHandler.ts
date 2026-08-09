import prisma from "../../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";

import { OrderHandler } from "./orderHandler";

import * as cartRepo from "../../cart/cart.repository";

export class OrderPricingHandler extends OrderHandler {
  async handle(
    request: OrderRequest,
    response: OrderResponse
  ): Promise<OrderResponse> {
    const client = request.tx ?? prisma;

    const cartItems = await cartRepo.getCartItems(request.cartId, client);
    const menuItemIds = cartItems.map((item) => item.menuItemId);
    const menuItems = await cartRepo.getMenuItemsByIds(menuItemIds, client);
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));

    let totalPrice = new Decimal(0);
    const orderItems = [];

    for (const cartItem of cartItems) {
      const menuItem = menuItemMap.get(cartItem.menuItemId)!;

      const itemTotal = menuItem.price.mul(cartItem.quantity);
      totalPrice = totalPrice.plus(itemTotal);

      orderItems.push({
        menuItemId: menuItem.id,
        itemName: menuItem.itemName,
        price: menuItem.price,
        quantity: cartItem.quantity,
        itemTotal,
      });
    }


    response.totalPrice = totalPrice;
    response.orderItems = orderItems;

    return this.handleNext(request, response);
  }
}