import {z} from "zod";
import {Role} from "@prisma/client"

export const signupSchema = z.object({
    name: z.string({required_error: "name is required"}).min(6,'name must be at least 6 characters'),
    email: z.string({required_error: "email is required"}).email("email is invalid"),
    password: z.string({ required_error: "password is required" })
  .min(6, "password must be at least 6 characters"),
    phone: z.string({required_error: "phone is required"}).regex(/^01[0125][0-9]{8}$/, "phone must be a valid Egyptian number"),
})

export const loginSchema = z.object({
     email: z.string({required_error: "email is required"}).email("email is invalid"),
    password: z.string({ required_error: "password is required" })
  .min(6, "password must be at least 6 characters")
})

export const forgetPasswordSchema = z.object({
    email: z.string({required_error: "email is required"}).email("email is invalid"),
});

export const resetPasswordSchema = z.object({
    email: z.string({required_error: "email is required"}).email("email is invalid"),
    newPassword: z.string({required_error: "new password is required"}).min(6),
    otp: z.string({required_error: "otp is required"}).length(6, "otp must be 6 digits"),
})
