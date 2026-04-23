import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if('statusCode' in err){
    return res.status((err as any).statusCode).json({
      status:'error',
      message:(err as any).message
    })
  }


  res.status(500).json({
    status: 'error',
    message: 'internal server error',
  });
};

export default globalErrorHandler;
