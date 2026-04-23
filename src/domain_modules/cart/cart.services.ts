import * as cartRepo from "./cart.repository";
import AppError from "../../utils/appError";
import { Cart } from "@prisma/client";
import { buildCartResponse } from "../../shared/cart.mapper";
import {

	StatusCodes
	
} from 'http-status-codes';

export const addToCart = async (
  userId: number,
  menuItemId: number,
  quantity: number
) => {
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new AppError("Product not found", StatusCodes.NOT_FOUND);
  }
  if (menuItem.stock < quantity) {
    throw new AppError("Not enough product stock available",  StatusCodes.BAD_REQUEST);
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
    throw new AppError("Menu item not found now", StatusCodes.NOT_FOUND);
  }

  let cart = await cartRepo.findActiveCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }
  if (menuItem.stock < quantity) {
    throw new AppError("Not enough stock available", StatusCodes.BAD_REQUEST);
  }

  await cartRepo.addOrUpdateCartItem(cart.id, menuItemId, quantity, menuItem.price);

  return await cartRepo.getCartByUserId(userId);
}

export const removeItem = async (userId: number, menuItemId: number) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) {
    throw new AppError("Cart not found", StatusCodes.NOT_FOUND);
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
    throw new AppError("Cart not found", StatusCodes.NOT_FOUND);
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
    throw new AppError("menuItemId and quantity are required", StatusCodes.BAD_REQUEST);
  }

  if (quantity < 0) {
    throw new AppError("Quantity cannot be negative", StatusCodes.BAD_REQUEST);
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

  const [item, menuItem] = await Promise.all([
    cartRepo.findCartItem(cartId, menuItemId),
    cartRepo.findMenuItemById(menuItemId),
  ]);

  if (!menuItem) {
    throw new AppError("Menu item not found", StatusCodes.BAD_REQUEST);
  }

  const currentQuantity = item?.quantity ?? 0;
  const currentQuantity = item?.quantity ?? 0;

  const newQuantity =
    mode === "increment"
      ? currentQuantity + quantity
      : mode === "decrement"
      ? currentQuantity - quantity
      : quantity;

 
  if (newQuantity > menuItem.stock) {
    throw new AppError(
      `Not enough stock for "${menuItem.name}". Only ${menuItem.stock} left`,
      400
    );
  }

  const newQuantity =
    mode === "increment"
      ? currentQuantity + quantity
      : mode === "decrement"
      ? currentQuantity - quantity
      : quantity;

 
  if (newQuantity > menuItem.stock) {
    throw new AppError(
      `Not enough stock for "${menuItem.name}". Only ${menuItem.stock} left`,
      400
    );
  }

  if (newQuantity <= 0) {
    await cartRepo.removeCartItem(cartId, menuItemId);
    return { message: "Item removed from cart" };
  }

  if (!item) {
    return cartRepo.createCartItem(
      cartId,
      menuItemId,
      newQuantity,
      menuItem.price
    );
  }

  await cartRepo.updateCartItem(item.id, newQuantity);

 
  const updatedCart = await cartRepo.getCartByUserId(userId);
  return buildCartResponse(updatedCart);
};
