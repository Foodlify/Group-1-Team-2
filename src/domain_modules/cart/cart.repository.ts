import prisma from "../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { CartStatus } from "@prisma/client";
import { DBClient } from "../../types/PrismaClientOrTx";


export const findMenuItemById = async (id: number) => {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      menu: true,
    },
  });
};

export const findActiveCartByCustomerId = async (
  customerId: number,
  client:any = prisma
) => {
  return client.cart.findFirst({
    where: { customerId: customerId, status: CartStatus.ACTIVE},
  });
};

export const createCartFirstTime = async (userId: number) => {
  return prisma.cart.create({
    data: { 
       customerId: userId, 
       status:  CartStatus.ACTIVE,
      restaurantId: 0 },
  });
};

export const createCart = async (customerId: number, restaurantId: number) => {
  return prisma.cart.create({
    data: {
      status:  CartStatus.ACTIVE,
      customer: {
        connect: { id: customerId }
      },
      restaurant: {
        connect: { id: restaurantId }
      }
    },
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

export const getCartByCustomerId = async (customerId: number) => {
    return await prisma.cart.findFirst({
        where: { 
            customerId: customerId,
            status:  CartStatus.ACTIVE,
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


export const lockCart = async (cartId: number,  client:any = prisma) => {
  return await client.cart.update({where:{id:cartId},data:{status:CartStatus.LOCKED}});
};

export const getCartItems = async (cartId: number, client:DBClient = prisma) => {
  return await client.cartItem.findMany({where:{cartId}});
};

export const getMenuItemsByIds = async (menuItemsIds: number[], client:DBClient = prisma) => {
  return await client.menuItem.findMany({where:{id:{in:menuItemsIds}}});
}