import { StatusCodes } from "http-status-codes";

export class PaymentFailedException extends Error {
  public statusCode = StatusCodes.BAD_REQUEST;

  constructor() {
    super("Payment failed");
    this.name = "PaymentFailedException";
  }
}