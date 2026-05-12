import { OrderRequest } from "../../types/OrderRequest";
import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import * as OrderServices from "./order.services";
import { sendSucess } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const request: OrderRequest = {
    userId: req.userId as number,
    cartId: req.body.cartId,
    restaurantId: req.body.restaurantId,
    addressId: req.body.addressId,
    phone: req.body.phone,
    notes: req.body.notes,
    paymentMethod: req.body.paymentMethod,
  };

  const response = await OrderServices.createOrder(request);

  sendSucess(res, {
    message: "Order created successfully",
    statusCode: StatusCodes.CREATED,
    data: response,
  });
});
