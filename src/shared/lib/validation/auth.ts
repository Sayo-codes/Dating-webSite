import { z } from "zod";

const emailSchema = z.string().email("Invalid email address");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password too long");
const usernameSchema = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(32, "Username too long")
  .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscore and hyphen");

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must be digits only"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
