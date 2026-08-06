import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z
    .email("Enter a valid email address")
    .trim()
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export type sigUpFormSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .email("Enter a valid email address")
    .trim()
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long"),
});

export type sigInFormSchemaType = z.infer<typeof signInSchema>;

// Verification code schema
export const verificationCodeSchema = z.object({
  verificationCode: z
    .string()
    .min(6, "Verification code must be 6 characters long"),
});

export type verificationCodeFormSchemaType = z.infer<
  typeof verificationCodeSchema
>;
