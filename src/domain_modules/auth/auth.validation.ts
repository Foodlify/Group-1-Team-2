import {z} from "zod";

export const signupSchema = z.object({
    name: z.string({required_error: "name is required"}).min(6,'name must be at least 10 characters'),
    email: z.string({required_error: "email is required"}).email("email is invalid"),
    password: z.string({required_error: "password is required"}).min(6),
    phone: z.string({required_error: "phone is required"}).regex(/^01[0125][0-9]{8}$/, "phone must be a valid Egyptian number"),
})