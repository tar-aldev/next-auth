import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z
  .object({
    id: z.optional(z.string()),
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );
export type SettingsFormValues = z.infer<typeof SettingsSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});
export type NewPasswordFormValues = z.infer<typeof NewPasswordSchema>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export type ResetPasswordFormValues = z.infer<typeof ResetSchema>;

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export type LoginFormValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export type RegisterFormValues = z.infer<typeof RegisterSchema>;
