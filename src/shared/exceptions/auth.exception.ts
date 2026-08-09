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

export class ForbiddenException  extends Error{
    statusCode: number;
    constructor(){
        super("You are not authorized to access this resource");
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

export class InvalidRefreshTokenException extends Error {
  statusCode: number;

  constructor() {
    super("Invalid or expired refresh token");
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class SecurityBreachException extends Error {
  statusCode: number;

  constructor() {
    super("Token reuse detected. All sessions have been terminated for security.");
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class OtpNotFoundException extends Error {
  statusCode: number;

  constructor() {
    super("No active OTP found. Please request a new one.");
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class OtpMaxAttemptsExceededException extends Error {
  statusCode: number;

  constructor() {
    super("Max attempts exceeded. Please request a new OTP.");
    this.statusCode = StatusCodes.TOO_MANY_REQUESTS;
  }
}

export class InvalidResetTokenException extends Error {
  statusCode: number;

  constructor() {
    super("Invalid or expired reset token");
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class ResetTokenAlreadyUsedException extends Error {
  statusCode: number;

  constructor() {
    super("This reset token has already been used");
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}