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


type UpdateMode = "set" | "increment";
export const upsertCartItem = async (
  userId: number,
  menu_item_id: number,
  quantity: number,
  mode: UpdateMode = "set"
) => {

  const menuItem = await cartRepo.findMenuItemById(menu_item_id);

  if (!menuItem) {
    throw new AppError("Menu item not found", 404);
  }

  let cart: Cart | null = await cartRepo.getCartByUserId(userId);

  if (!cart) {
    cart = await cartRepo.createCart(userId);
  }

  const existingItem = await cartRepo.findCartItem(cart.id, menu_item_id);

  let finalQuantity: number;

  if (mode === "set") {
    finalQuantity = quantity
  } else {
    finalQuantity = existingItem ? existingItem.quantity + quantity : quantity;
  }

  if (finalQuantity <= 0) {
    await cartRepo.removeCartItem(cart.id, menu_item_id)

    return await cartRepo.getCartWithItems(cart.id)
  }

  if (menuItem.stock < finalQuantity) {
    throw new AppError("Not enough stock available", 400);
  }

  await cartRepo.addOrUpdateCartItem(
    cart.id,
    menu_item_id,
    finalQuantity,
    menuItem.price
  );

  return await cartRepo.getCartWithItems(cart.id);
}