import * as cartRepo from "./cart.repository";
import AppError from "../../utils/appError";
import { Cart } from "@prisma/client";

export const addToCart = async (
  userId: number,
  menuItemId: number,
  quantity: number
) => {
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new AppError("Product not found", 400);
  }
  if (menuItem.stock < quantity) {
    throw new AppError("Not enough product stock available", 400);
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
  const formattedItems = cart.items.map(item => ({
    itemId: item.id,
    productId: item.menuItem.id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    quantity: item.quantity,
    itemTotal: item.quantity * item.menuItem.price
  }));

  const totalPrice = formattedItems.reduce((acc, item) => acc + item.itemTotal, 0);

  return {
    cartId: cart.id,
    status: cart.status,
    items: formattedItems,
    totalPrice: totalPrice,
    itemCount: formattedItems.length
  }
}

export const modifyCart = async (userId: number, menuItemId: number, quantity: number) => {
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new AppError("Menu item not found now", 404);
  }

  let cart = await cartRepo.findActiveCartByUserId(userId);
  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }
  if (menuItem.stock < quantity) {
    throw new AppError("Not enough stock available", 400);
  }

  await cartRepo.addOrUpdateCartItem(cart.id, menuItemId, quantity, menuItem.price);

  return await cartRepo.getCartByUserId(userId);
}

export const removeItem = async (userId: number, menuItemId: number) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await cartRepo.findCartItem(cart.id, menuItemId);
  if (!cartItem) {
    throw new AppError("Item not found in cart", 404);
  }

  await cartRepo.removeCartItem(cart.id, menuItemId);

  return await cartRepo.getCartByUserId(userId);
};

export const clearCart = async (userId: number) => {
  const cart = await cartRepo.getCartByUserId(userId);
  if (!cart) {
    throw new AppError("Cart not found", 404);
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

  let cart = await cartRepo.findActiveCartByUserId(userId);

  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }

  const cartId = cart.id;

  const item = await cartRepo.findCartItem(cartId, menuItemId);
  const menuItem = await cartRepo.findMenuItemById(menuItemId);

  if (!menuItem) {
    throw new Error("Menu item not found");
  }

  let newQuantity = item ? item.quantity : 0;

  switch (mode) {
    case "increment":
      newQuantity += quantity;
      break;

    case "decrement":
      newQuantity -= quantity;
      break;

    case "set":
    default:
      newQuantity = quantity;
      break;
  }

if (newQuantity > menuItem.stock) {
  throw new AppError(
    `Not enough stock for "${menuItem.name}". Only ${menuItem.stock} left in stock`,400
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