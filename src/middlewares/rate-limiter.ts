import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10000 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 10000 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again later." },
});
