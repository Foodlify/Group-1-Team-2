import { StatusCodes } from "http-status-codes";

export class EmailAlreadyExistsException  extends Error{
    public statusCode = StatusCodes.BAD_REQUEST
    constructor(){
        super("Email already exists");
        this.name = "EmailAlreadyExistsException";
    }
}