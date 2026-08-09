import { MenuItem,Order,OrderItem} from "@prisma/client"
import prisma from "../../lib/prisma"
import {DBClient} from "../../types/PrismaClientOrTx"

export const getMenuItemsByIds = async (
  ids: number[],
  tx: any
):Promise<MenuItem[]> => {
  return tx.menuItem.findMany({
    where: { id: { in: ids } },
  })
}

export const createAddress = async(newAddress:any , tx:any)=>{
return tx.address.create({data:newAddress})
}


export const createOrder = async (
  data: any,
  client:DBClient  = prisma
) => {
  return client.order.create({
    data: {
      customer: {
        connect: { id: data.customerId },
      },
      restaurant: {
        connect: { id: data.restaurantId },
      },
      address: {
        connect: { id: data.addressId },
      },
      phone: data.phone,
      notes: data.notes,
      paymentMethod: data.paymentMethod,
      totalPrice: data.totalPrice,
    },
  });
};

export const createOrderItems = async (items: any[], orderId: number, client:DBClient = prisma) => {
    return await client.orderItem.createMany({ data:items.map(item=>({...item,orderId})) })
}

export const updateMenuItemStock = async (items:{id:number,quantity: number}[], tx: any) => {
return Promise.all(
  items.map((item:any)=>{
    return tx.menuItem.update({
      where:{id:item.id},
      data:{stock:{decrement:item.quantity}}
    })
  })
)
}

export const getOrderById = async (id: number):Promise<Order|null> => {
    return await prisma.order.findUnique({ where: { id } })
}

export const findAllOrdersByUserId = async (customerId: number) => {
    return await prisma.order.findMany({
        where: { customerId },
        include: {
            orderItems: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
};

export const findOrderByIdAndUserId = async (orderId: number, customerId: number) => {
    return await prisma.order.findFirst({
        where: { id: orderId, customerId },
        include: {
            orderItems: {
                include: {
                    menuItem: true,
                },
            },
        },
    });
}

