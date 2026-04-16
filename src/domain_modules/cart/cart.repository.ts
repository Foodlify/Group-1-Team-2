import prisma from "../../lib/prisma";

export const findMenuItemById = async (id: number) => {
  return prisma.menuItem.findUnique({
    where: { id },
  });
};

export const findActiveCartByUserId = async (userId: number) => {
  return prisma.cart.findFirst({
    where: { user_id: userId, status: "active" },
  });
};

export const createCart = async (userId: number) => {
  return prisma.cart.create({
    data: { user_id: userId, status: "active" },
  });
};

export const addOrUpdateCartItem = async (
  cartId: number,
  menuItemId: number,
  quantity: number,
  price: number
) => {
  return prisma.cartItem.upsert({
    where: {
      cart_id_menu_item_id: { cart_id: cartId, menu_item_id: menuItemId },
    },
    update: { quantity, price },
    create: {
      cart_id: cartId,
      menu_item_id: menuItemId,
      quantity,
      price,
    },
  });
};

export const getCartWithItems = async (cartId: number) => {
  return prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: { menuItem: true },
      },
    },
  });
};


export const viewCart = async (userId :number) =>{
  return prisma.cart.findFirst({
    where:{
      user_id:userId,
      status:"active"
    },
    include:{
      items:{
        include:{
          menuItem:true
        }
      }
    }
  })
}