import { Request, Response } from "express";
import * as cartService from "./cart.services";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendSucess,sendError } from "../../utils/response";
import {
	StatusCodes
} from 'http-status-codes';

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.userId as number;

  const updatedCart = await cartService.addToCart(
    userId,
    menuItemId,
    quantity
  );

  sendSucess(res,{message:"Item added to cart successfully",statusCode:StatusCodes.CREATED,data:updatedCart})
});

export const viewCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId as number;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  const cartData = await cartService.viewCart(userId);
   sendSucess(res,{statusCode:StatusCodes.OK,data:cartData})
});

export const modifyCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as number;
    const { menuItemId, quantity } = req.body;

    const cart = await cartService.modifyCart(userId, menuItemId, quantity);

    sendSucess(res,{message: "Cart modified successfully",statusCode:StatusCodes.OK,data:cart})
  
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as number;
    const  menuItemId  = Number(req.params.menuItemId);

   const cart = await cartService.removeItem(userId, menuItemId);
 sendSucess(res,{message:  "Item removed from cart successfully",statusCode:StatusCodes.OK,data:cart})

});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId as number;

    const cart = await cartService.clearCart(userId);

    return res.status(200).json({
        message: "Cart cleared successfully",
        data: { cart }
    });
});


export const updateCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.userId as number;
    const { menuItemId, quantity, mode = "set" } = req.body;

  
  

    const result = await cartService.updateCartItem(
      userId,
      Number(menuItemId),
      Number(quantity),
      mode
    );

    return res.status(200).json({
      status: "success",
      data: result,
    });
  }
);