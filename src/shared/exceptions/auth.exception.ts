import { StatusCodes } from "http-status-codes";

export class EmailAlreadyExistsException  extends Error{
    statusCode: number;
    constructor(){
        super("Email already exists");
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export class InvalidCredentialsException extends Error {
  statusCode: number;

  constructor() {
    super("Invalid email or password");
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class UnauthorizedException  extends Error{
    statusCode: number;
    constructor(){
        super("You are not authorized to access this resource, please login first");
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}