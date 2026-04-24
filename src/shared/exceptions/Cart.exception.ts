import { StatusCodes } from "http-status-codes";

export class CartNotFoundExeption extends Error {
   public statusCode = StatusCodes.NOT_FOUND
   constructor(){
    super(`Cart not found`);
    this.name = "CartNotFoundExeption"
   }
}

export class MultipleRestaurantCartException extends Error {
   public statusCode = StatusCodes.BAD_REQUEST
   constructor(){
    super(`Cannot add items from different restaurants to the same cart`);
    this.name = "MultipleRestaurantCartException"
   }
}
