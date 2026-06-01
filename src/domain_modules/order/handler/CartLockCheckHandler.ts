import { OrderHandler } from "./orderHandler";
import { OrderRequest } from "../../../types/OrderRequest";
import { OrderResponse } from "../../../types/OrderResponse";
import prisma from "../../../lib/prisma";
import { CartStatus } from "@prisma/client";
import { CartAlreadyCompletedException, CartLockedException, CartNotFoundExeption } from "../../../shared/exceptions/Cart.exception";
import * as cartRepo from "../../cart/cart.repository";


export class CartCheckHandler extends OrderHandler {

    async handle(request:OrderRequest , response:OrderResponse):Promise<OrderResponse>{
        const client = request.tx ?? prisma ;
        const cart = await cartRepo.findActiveCartByCustomerId(
            request.cartId,
            client
        );

        if(!cart){
            throw new CartNotFoundExeption();
        }

        // add exception in the exception folder
        if(cart.status === CartStatus.LOCKED){
            throw new CartLockedException();
        }

        if(cart.status === CartStatus.COMPLETED){
            throw new CartAlreadyCompletedException();
        }

        await cartRepo.lockCart(cart.id,client);
        
        response.restaurantId = cart.restaurantId;
        return this.handleNext(request,response);
    }

}