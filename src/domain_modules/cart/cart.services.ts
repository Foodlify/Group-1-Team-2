import * as cartRepo from "./cart.repository";
import AppError from "../../utils/appError";

export const addToCart = async (
  userId: number,
  menuItemId: number,
  quantity: number
) => {
  const menuItem = await cartRepo.findMenuItemById(menuItemId);
  if (!menuItem) {
    throw new Error("Product not found");
  }
  if (menuItem.stock < quantity) {
    throw new Error("Not enough product stock available");
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



export const viewCart= async (userId:number)=>{

  const cart = await cartRepo.viewCart(userId);

  if(!cart){
    return {
      cartId:null,
      items:[],
      totalPrice:0,
      itemCount:0
    }
  }
  const formattedItems = cart.items.map(item=>({
    itemId:item.id,
    productId: item.menuItem.id,
    name:item.menuItem.name,
    price:item.menuItem.price,
    quantity: item.quantity,
    itemTotal: item.quantity * item.menuItem.price
  }));

  const totalPrice = formattedItems.reduce((acc, item) => acc + item.itemTotal, 0);

  return {
    cartId:cart.id,
    status:cart.status,
    items:formattedItems,
    totalPrice:totalPrice,
    itemCount:formattedItems.length
  }


}

export const modifyCart = async (userId: number, menuItemId: number, quantity: number) => {
       // get menu item 
       const menuItem = await cartRepo.findMenuItemById(menuItemId);

        if (!menuItem) {
            throw new AppError("Menu item not found now ",404);
        }
        // get or create cart for user
        let cart = await cartRepo.getCartByUserId(userId);
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
