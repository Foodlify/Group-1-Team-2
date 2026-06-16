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

export class UserNoLongerExistsException  extends Error{
    statusCode: number;
    constructor(){
        super("User no longer exists");
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}


export class UserNotFoundException extends Error {
  statusCode: number;

  constructor() {
    super("User not found");
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class OTPEmailFailedException extends Error {
  statusCode: number;

  constructor() {
    super("Failed to send OTP email");
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class InvalidOTPRequestException extends Error {
  statusCode: number;

  constructor() {
    super("No OTP request found for this user");
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class OTPExpiredException extends Error {
  statusCode: number;

  constructor() {
    super("OTP expired");
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class InvalidOTPException extends Error {
  statusCode: number;

  constructor() {
    super("Invalid OTP");
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class NoTAUTHORIZED extends Error {
    statusCode: number;

    constructor() {
        super("You are not authorized to perform this action");
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}


export class NOTAUTHENTICATED extends Error {
      statusCode: number;

    constructor() {
        super("You are not authenticated to perform this action");
        this.statusCode = StatusCodes.FORBIDDEN;
    }

}
