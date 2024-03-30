"use server";

import { signIn } from "@/auth";
import { LoginFormValues, LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const login = async (values: LoginFormValues) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validatedValues.data;
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    console.log("error", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }

  return { success: "Success" };
};
