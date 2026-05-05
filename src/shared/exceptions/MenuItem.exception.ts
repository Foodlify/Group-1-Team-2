import { StatusCodes } from "http-status-codes";

export class MenuItemNotFoundException extends Error {
  public statusCode = StatusCodes.NOT_FOUND;

  constructor(menuItemId: number) {
    super(`MenuItemNotFound with id ${menuItemId} not found`);
    this.name = "MenuItemNotFoundException";
  }
}

export class StockNotEnoughException extends Error {
  public statusCode = StatusCodes.BAD_REQUEST;

  constructor(menuItemId: number,menuItemStock:number) {
    super(`Not enough stock available for product with id ${menuItemId}, avaliable: ${menuItemStock}`);
    this.name = "StockNotEnoughException";
  }
}

export class RequiredFieldsException extends Error {
  public statusCode = StatusCodes.BAD_REQUEST;

  constructor() {
    super("menuItemId and quantity are required");
    this.name = "RequiredFieldsException";
  }
}

export class InvalidQuantityException extends Error {
  public statusCode = StatusCodes.BAD_REQUEST;
  
  constructor() {
    super("Quantity cannot be negative");
    this.name = "InvalidQuantityException";
  }
}


