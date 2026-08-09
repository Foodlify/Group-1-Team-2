import * as cartRepo from "./cart.repository";
import * as customerServices from "../customer/customer.services";
import AppError from "../../utils/appError";
import { buildCartResponse } from "../../shared/cart.mapper";
import {	StatusCodes } from 'http-status-codes';
import { MenuItemNotFoundException, StockNotEnoughException } from "../../shared/exceptions/MenuItem.exception";
import { CartNotFoundExeption, MultipleRestaurantCartException } from "../../shared/exceptions/Cart.exception";
import { MenuItem } from "./cart.model";
import { Decimal } from "@prisma/client/runtime/library";

export const addToCart = async (userId: string, menuItemId: number, quantity: number, restaurantId: number) => {

  const menuItem = await cartRepo.findMenuItemById(menuItemId);

  validateMenuItem(menuItem, quantity, menuItemId);

  const customer = await customerServices.getCustomerByUserId(userId);
  
  let cart = await getValidCartForMenuItem(customer.id, restaurantId);

  await addItemToCart(cart.id, menuItemId, quantity, menuItem.price);

  return await cartRepo.getCartWithItems(cart.id);
};

function validateMenuItem(menuItem: MenuItem | null,quantity: number,menuItemId: number): asserts menuItem is MenuItem {
  if (!menuItem) {
    throw new MenuItemNotFoundException(menuItemId);
  }

  if (menuItem.stock < quantity) {
    throw new StockNotEnoughException(menuItemId,menuItem.stock);
  }
}

const getValidCartForMenuItem = async (customerId: number, restaurantId: number) => {
  let cart = await cartRepo.findActiveCartByCustomerId(customerId);

  if (!cart) {
   return await cartRepo.createCart(customerId, restaurantId);
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

export const viewCart = async (userId: string) => {

  const customer = await customerServices.getCustomerByUserId(userId);
  const cart = await cartRepo.getCartByCustomerId(customer.id);
  
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

export const modifyCart = async (userId: string, menuItemId: number, quantity: number, restaurantId: number) => {
  const customer = await customerServices.getCustomerByUserId(userId);

  const menuItem = await cartRepo.findMenuItemById(menuItemId);

  validateMenuItem(menuItem, quantity, menuItemId);

  const cart = await getValidCartForMenuItem(customer.id, restaurantId);

  await cartRepo.addOrUpdateCartItem(cart.id, menuItemId, quantity, menuItem.price);


  return await cartRepo.getCartByCustomerId(customer.id);
}

export const removeItem = async (userId: string, menuItemId: number) => {
const customer = await customerServices.getCustomerByUserId(userId);

const cart= await cartRepo.getCartByCustomerId(customer.id);

  if (!cart) {
    throw new CartNotFoundExeption();
  }

  const cartItem = await cartRepo.findCartItem(cart.id, menuItemId);
  if (!cartItem) {
    throw new AppError("Item not found in cart", StatusCodes.NOT_FOUND);
  }

  await cartRepo.removeCartItem(cart.id, menuItemId);

  return await cartRepo.getCartByCustomerId(customer.id);
};

export const clearCart = async (userId: string) => {
  const customer = await customerServices.getCustomerByUserId(userId);

const cart= await cartRepo.getCartByCustomerId(customer.id);

  if (!cart) {
    throw new CartNotFoundExeption();
  }

  await cartRepo.clearCartItems(cart.id);

  return await cartRepo.getCartByCustomerId(customer.id);
};

export const lockCart = async (cartId: number,tx: any) => {
  return await cartRepo.lockCart(cartId,tx);
};

