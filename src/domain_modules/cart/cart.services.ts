import * as cartRepo from "./cart.repository";
import AppError from "../../utils/appError";
import { Cart } from "@prisma/client";
import { buildCartResponse } from "../../shared/cart.mapper";
import {	StatusCodes } from 'http-status-codes';
import { MenuItemNotFoundException,StockNotEnoughException,RequiredFieldsException ,InvalidQuantityException} from "../../shared/exceptions/MenuItem.exception";
import { CartNotFoundExeption } from "../../shared/exceptions/Cart.exception";

  console.log("MenuItemNotFoundException =", MenuItemNotFoundException);

export const addToCart = async (
  userId: number,
  menuItemId: number,
  quantity: number
) => {
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new MenuItemNotFoundException(menuItemId);
  }
  if (menuItem.stock < quantity) {
    throw new StockNotEnoughException(menuItemId);
  }

  let cart = await cartRepo.findActiveCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }

  await cartRepo.addOrUpdateCartItem(
    cart.id,
    menuItemId,
    quantity,
    menuItem.price
  );

  const updatedCart = await cartRepo.getCartWithItems(cart.id);
  return updatedCart;
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

export const modifyCart = async (userId: number, menuItemId: number, quantity: number) => {
  
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new MenuItemNotFoundException(menuItemId);
  }

  let cart = await cartRepo.findActiveCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }
  if (menuItem.stock < quantity) {
    throw new StockNotEnoughException(menuItemId);
  }

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

export const updateCartItem = async (
  userId: number,
  menuItemId: number,
  quantity: number,
  mode: "set" | "increment" | "decrement"
) => {

  if (!menuItemId || quantity === undefined) {
    throw new RequiredFieldsException();
  }

  if (quantity < 0) {
    throw new InvalidQuantityException();
  }

  let cart = await cartRepo.findActiveCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }

  const cartId = cart.id;

  const [item, menuItem] = await Promise.all([
    cartRepo.findCartItem(cartId, menuItemId),
    cartRepo.findMenuItemById(menuItemId),
  ]);

   if (!menuItem) {
    throw new MenuItemNotFoundException(menuItemId);
  }

  const currentQuantity = item?.quantity ?? 0;

  const newQuantity =
    mode === "increment"
      ? currentQuantity + quantity
      : mode === "decrement"
      ? currentQuantity - quantity
      : quantity;

  if (newQuantity > menuItem.stock) {
    throw new StockNotEnoughException(menuItemId);
  }

  if (newQuantity <= 0) {
    await cartRepo.removeCartItem(cartId, menuItemId);
    return { message: "Item removed from cart" };
  }

  if (!item) {
    return cartRepo.createCartItem(cartId, menuItemId, newQuantity, menuItem.price);
  }

  await cartRepo.updateCartItem(item.id, newQuantity);

  const updatedCart = await cartRepo.getCartByUserId(userId);
  return buildCartResponse(updatedCart);
};