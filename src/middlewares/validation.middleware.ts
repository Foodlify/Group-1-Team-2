import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validation = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = {...req.body,...req.params,...req.query};
    const result = schema.safeParse(data);

    if (!result.success) {
       console.log(JSON.stringify(result.error.errors, null, 2))
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join(", ");

      const error = new Error(errorMessage) as any;
      error.statusCode = 400;

      return next(error);
    }

    next();
  };
};