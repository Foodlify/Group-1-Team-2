import { StatusCodes } from "http-status-codes";

export class AddressNotFoundOrNotOwnedException extends Error {
  public statusCode = StatusCodes.NOT_FOUND;

  constructor() {
    super("Address not found or inaccessible");
    this.name = "AddressNotFoundOrNotOwnedException";
  }
}