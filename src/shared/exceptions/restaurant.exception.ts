import { StatusCodes } from "http-status-codes";

export class RestaurantNotFoundException extends  Error {
    public statusCode = StatusCodes.NOT_FOUND;
    constructor(){
      super("Resturant not found");
      this.name = "RestaurantNotFoundException";
    }
}

export class NOTALLOWEDTOCREATEMORETHANONE extends Error {
    public statusCode = StatusCodes.CONFLICT;
    constructor(){
      super("Admin can only create one restaurant");
      this.name = "NOTALLOWEDTOCREATEMORETHANONE";
    }
}