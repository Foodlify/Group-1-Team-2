import {z} from "zod";

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