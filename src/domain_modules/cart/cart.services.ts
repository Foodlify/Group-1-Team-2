import * as cartRepo from "./cart.repository";
import AppError from "../../utils/appError";
import { buildCartResponse } from "../../shared/cart.mapper";
import {	StatusCodes } from 'http-status-codes';
import { MenuItemNotFoundException, StockNotEnoughException } from "../../shared/exceptions/MenuItem.exception";
import { CartNotFoundExeption, MultipleRestaurantCartException } from "../../shared/exceptions/Cart.exception";
import { MenuItem } from "./cart.model";
import { Decimal } from "@prisma/client/runtime/library";

export const addToCart = async (userId: number, menuItemId: number, quantity: number, restaurantId: number) => {

  const menuItem = await cartRepo.findMenuItemById(menuItemId);

  validateMenuItem(menuItem, quantity, menuItemId);

  let cart = await getValidCartForMenuItem(userId, restaurantId);

  await addItemToCart(cart.id, menuItemId, quantity, menuItem.price);

  return await cartRepo.getCartWithItems(cart.id);
};

function validateMenuItem(menuItem: MenuItem | null,quantity: number,menuItemId: number): asserts menuItem is MenuItem {
  if (!menuItem) {
    throw new MenuItemNotFoundException(menuItemId);
  }

  if (menuItem.stock < quantity) {
    throw new StockNotEnoughException(menuItemId);
  }
}

const getValidCartForMenuItem = async (userId: number, restaurantId: number) => {
  let cart = await cartRepo.findActiveCartByUserId(userId);

  if (!cart) {
    cart = await cartRepo.createCart(userId, restaurantId);
    return cart;
  }

  if (cart.restaurantId !== restaurantId) {
    throw new MultipleRestaurantCartException();
  }

  return cart;
};

const addItemToCart = async (cartId: number, menuItemId: number, quantity: number, price: Decimal) => {
  await cartRepo.addOrUpdateCartItem(
    cartId,
    menuItemId,
    quantity,
    price
  );
};

export const viewCart = async (userId: number) => {

  const cart = await cartRepo.getCartByUserId(userId);
  
  if (!cart) {
    return {
      cartId: null,
      items: [],
      totalPrice: 0,
      itemCount: 0
    }
  }
return buildCartResponse(cart)
}

export const modifyCart = async (userId: number, menuItemId: number, quantity: number, restaurantId: number) => {
  
  const menuItem = await cartRepo.findMenuItemById(menuItemId);

  validateMenuItem(menuItem, quantity, menuItemId);

  const cart = await getValidCartForMenuItem(userId, restaurantId);

  await cartRepo.addOrUpdateCartItem(cart.id, menuItemId, quantity, menuItem.price);

  return await cartRepo.getCartByUserId(userId);
}

export const removeItem = async (userId: number, menuItemId: number) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) {
    throw new CartNotFoundExeption();
  }

  const cartItem = await cartRepo.findCartItem(cart.id, menuItemId);
  if (!cartItem) {
    throw new AppError("Item not found in cart", StatusCodes.NOT_FOUND);
  }

  await cartRepo.removeCartItem(cart.id, menuItemId);

  return await cartRepo.getCartByUserId(userId);
};

export const clearCart = async (userId: number) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) {
    throw new CartNotFoundExeption();
  }

  await cartRepo.clearCartItems(cart.id);

  return await cartRepo.getCartByUserId(userId);
};