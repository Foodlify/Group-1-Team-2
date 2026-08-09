import prisma from "../../../lib/prisma";

import { SomeOfItemsNotAvailableException } from "../../../shared/exceptions/MenuItem.exception";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";

import { OrderHandler } from "./orderHandler";

import * as cartRepo from "../../cart/cart.repository";
import * as menuService from "../../menuItem/menuItem.services";

export class ItemsAvailabilityCheckHandler extends OrderHandler {
  async handle(
    request: OrderRequest,
    response: OrderResponse
  ): Promise<OrderResponse> {
    const client = request.tx ?? prisma;

    const cartItems = await cartRepo.getCartItems(request.cartId, client);
    const menuItemIds = cartItems.map((item) => item.menuItemId);
    const menuItems = await cartRepo.getMenuItemsByIds(menuItemIds, client);
    const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));


    for (const cartItem of cartItems) {
      const menuItem = menuItemMap.get(cartItem.menuItemId);

      if (!menuItem) {
        throw new SomeOfItemsNotAvailableException();
      }

      if (cartItem.quantity <= 0) {
        throw new Error("Invalid quantity");
      }
    }

    const reservationResults = await Promise.all(
      cartItems.map((cartItem) =>
        menuService.reserveStock(
          cartItem.menuItemId,
          cartItem.quantity,
          client
        )
      )
    );

    const hasFailed = reservationResults.some((res) => res.count === 0);
    if (hasFailed) {
      throw new SomeOfItemsNotAvailableException();
    }

   
    return this.handleNext(request, response);
  }
}