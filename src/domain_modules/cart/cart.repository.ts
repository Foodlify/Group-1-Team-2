import prisma from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export const findMenuItemById = async (id: number) => {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      menu: true,
    },
  });
};

export const findActiveCartByUserId = async (userId: number) => {
  return prisma.cart.findFirst({
    where: { customerId: userId, status: true },
  });
};

export const createCartFirstTime = async (userId: number) => {
  return prisma.cart.create({
    data: { customerId: userId, status: true, restaurantId: 0 },
  });
};

export const createCart = async (userId: number, restaurantId: number) => {
  return prisma.cart.create({
    data: { customerId: userId, status: true, restaurantId: restaurantId },
  });
};

export const addOrUpdateCartItem = async (
  cartId: number,
  menuItemId: number,
  quantity: number,
  price: Decimal
) => {
  return prisma.cartItem.upsert({
    where: {
      cartId_menuItemId: { cartId: cartId, menuItemId: menuItemId }
    },
    update: { quantity },
    create: {
      cartId: cartId,
      menuItemId: menuItemId,
      quantity,
    },
  });
};

export const getCartWithItems = async (cartId: number) => {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      cartItems: {
        include: { menuItem: true },
      },
    },
  });
};

export const getCartByUserId = async (userId: number) => {
    return await prisma.cart.findFirst({
        where: { 
            customerId: userId,
            status: true,
        },
        include: {
            cartItems: {
                include: {
                    menuItem: true,
                },
            },
        },
    });


    
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
    return await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });
};

export const createCartItem = async (
    cartId: number,
    menuItemId: number,
    quantity: number,
) => {
    return await prisma.cartItem.create({
        data: {
            cartId: cartId,
            menuItemId: menuItemId,
            quantity,
        },
    });
};

export const clearCartItems = async (cartId: number) => {
    return await prisma.cartItem.deleteMany({
        where: { cartId: cartId },
    });
};

export const findCartItem = async (cartId: number, menuItemId: number) => {
  return await prisma.cartItem.findFirst({
    where: {
      cartId: cartId,
      menuItemId: menuItemId,
    },
  });
};

export const removeCartItem = async (cartId: number, menuItemId: number) => {
    return await prisma.cartItem.delete({
        where: {
            cartId_menuItemId  : { cartId: cartId, menuItemId: menuItemId },
        },
    });
}

export const getMenuItemById  = async(id:number ,tx:any) => {
  return await tx.menuItem.findUnique({where:{id}})
}


export const lockCart = async (cartId: number,tx: any) => {
  return await tx.cart.update({where:{id:cartId},data:{status:false}});
};