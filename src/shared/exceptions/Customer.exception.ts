import { StatusCodes } from "http-status-codes";

export class CustomerNotFound extends Error {
   public statusCode = StatusCodes.NOT_FOUND
   constructor(userId:string){
    super(`Customer with id ${userId} not found`);
    this.name = "CustomerNotFoundException"
   }
}