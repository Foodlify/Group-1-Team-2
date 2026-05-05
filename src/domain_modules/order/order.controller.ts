import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import * as orderService from "./order.services";
import { sendSucess,sendError } from "../../utils/response";
import { StatusCodes} from 'http-status-codes';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
   const userId = req.userId as number;
   const body = req.body;

   const order = await orderService.createOrderService(userId, body);

   sendSucess(res,{message:"Order placed successfully",statusCode:StatusCodes.CREATED,data:order})
   res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Order placed successfully",
    data: order
})
}); 