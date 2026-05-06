import { StatusCodes } from "http-status-codes";

export class OrderNotFoundException extends Error {
    public statusCode = StatusCodes.NOT_FOUND
    constructor() {
        super("Order not found");
        this.name = "OrderNotFoundException";
    }
}
