import { z } from "zod";

export const signUpSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }),
  lastName: z.string().trim().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type signUpFormSchemaType = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type sigInFormSchemaType = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email("Enter a valid email address"),
});

export type forgotPasswordFormSchemaType = z.infer<
  typeof forgotPasswordSchema
>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type resetPasswordFormSchemaType = z.infer<
  typeof resetPasswordSchema
>;

// Verification code schema
export const verificationCodeSchema = z.object({
  verificationCode: z.string().trim().min(1, "Enter the verification code"),
});

export type verificationCodeFormSchemaType = z.infer<
  typeof verificationCodeSchema
>;
