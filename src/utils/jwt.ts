import jwt from "jsonwebtoken";

interface JwtCustomPayload {
  userId: number;
   iat: number;
  exp: number;
}

export const generateToken = (payload: object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};


export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtCustomPayload;
};