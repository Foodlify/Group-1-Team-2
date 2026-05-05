import { MenuItem, Prisma,Order } from "@prisma/client"
import prisma from "../../lib/prisma"


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


export const createOrder = async (data: any, tx: any) => {
    return await tx.order.create({ data })
}

export const createOrderItems = async (data: any, tx: any) => {
    return await tx.orderItem.createMany({ data })
}

export const updateMenuItemStock = async (items:{id:number,quantity: number}[], tx: any) => {
Promise.all(
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