import { Request, Response, NextFunction } from "express";
import * as cartService from "./cart.services";
import { asyncHandler } from "../../utils/asyncHandler";

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { menuItemId, quantity } = req.body;

    // Hardcode a userId for now until authentication is implemented
    const userId = 1;

    const updatedCart = await cartService.addToCart(
      userId,
      menuItemId,
      quantity
    );

    res.status(201).json({
      message: "Item added to cart successfully",
      data: updatedCart,
    });
  } catch (error: any) {
    if (
      error.message === "Product not found" ||
      error.message === "Not enough product stock available"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }

    next(error);
  }
};


export const viewCart = async (req:Request , res:Response )=>{
try {
  const userId  = parseInt(req.params.userId)

  if(isNaN(userId)){
    return res.status(400).json({message:"Invalid User ID"});
  }

  const cartData = await cartService.viewCart(userId)
  return res.status(200).json(cartData);

} catch (error) {
  console.error("View Cart Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
}
}

export const modifyCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.headers["x-user-id"]);
    const { menuItemId, quantity } = req.body;

    const cart = await cartService.modifyCart(userId, menuItemId, quantity);

    return res.status(200).json({
        message: "Cart modified successfully",
        data: { cart }
    });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
   
});



