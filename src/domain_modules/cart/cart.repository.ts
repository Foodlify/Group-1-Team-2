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


// export const getMenuItem = async (menuItemId: number) => {
//     return await prisma.menuItem.findUnique({
//         where: { id: menuItemId },
//     });
// };

export const getCartByUserId = async (userId: number) => {
    return await prisma.cart.findFirst({
        where: { 
            user_id: userId,
            status: "active",
        },
        include: {
            items: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
};



export const getCartItem = async (cartId: number, menuItemId: number) => {
    return await prisma.cartItem.findFirst({
        where: {
            cart_id: cartId,
            menu_item_id: menuItemId,
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
    price: number
) => {
    return await prisma.cartItem.create({
        data: {
            cart_id: cartId,
            menu_item_id: menuItemId,
            quantity,
            price,
        },
    });
};

export const clearCartItems = async (cartId: number) => {
    return await prisma.cartItem.deleteMany({
        where: { cart_id: cartId },
    });
};