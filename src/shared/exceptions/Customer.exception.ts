import { StatusCodes } from "http-status-codes";

export class CustomerNotFound extends Error {
   public statusCode = StatusCodes.NOT_FOUND
   constructor(customerId:string){
    super(`Customer with id ${customerId} not found`);
    this.name = "CustomerNotFoundException"
   }
}