import { StatusCodes } from "http-status-codes";
export class MenuNotFoundException extends Error {
   public statusCode = StatusCodes.NOT_FOUND
   constructor(){
    super(`Menu not found`);
    this.name = "MenuNotFoundException"
   }
}

