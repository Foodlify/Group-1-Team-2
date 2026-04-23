import { StatusCodes } from "http-status-codes";

export class CartNotFoundExeption extends Error {
   public statusCode = StatusCodes.NOT_FOUND
   constructor(){
    super(`Cart not found`);
    this.name = "CartNotFoundExeption"
   }
}

