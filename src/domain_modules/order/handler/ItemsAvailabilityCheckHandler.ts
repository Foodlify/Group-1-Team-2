import prisma from "../../../lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { SomeOfItemsNotAvailableException } from "../../../shared/exceptions/MenuItem.exception";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import { OrderHandler } from "./orderHandler";

export class ItemsAvailabilityCheckHandler  extends OrderHandler{
    async handle(request:OrderRequest , response:OrderResponse):Promise<OrderResponse>{ 
       const cartItems = await prisma.cartItem.findMany({where:{cartId:request.cartId}});
       const menuItemsId= cartItems.map(item=>item.menuItemId);
       const menuItems = await prisma.menuItem.findMany({where:{id:{in:menuItemsId}}});
    
       const menuItemMap = new Map(menuItems.map(item=>[item.id,item]));

        let totalPrice = 0;
        const orderItems = [];
        
       // check stock and exist
       for(const item of cartItems){
         const menuItem = menuItemMap.get(item.menuItemId);
         if(!menuItem) throw new SomeOfItemsNotAvailableException();
         if(menuItem.stock < item.quantity) throw new SomeOfItemsNotAvailableException();

          totalPrice += Number(menuItem.price) * item.quantity;
       
         orderItems.push({
           menuItemId: menuItem.id,
           itemName: menuItem.itemName,
           price: Number(menuItem.price),
           quantity: item.quantity,
           itemTotal: new Decimal( Number(menuItem.price) * item.quantity)
         })
       }

        response.totalPrice =  new Decimal(totalPrice);
        response.orderItems = orderItems;

        
       return this.handleNext(request,response);

    }
}
