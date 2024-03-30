"use server";

import { LoginFormValues, LoginSchema } from "../schemas";

export const login = async (values: LoginFormValues) => {
  const validatedValues = LoginSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Success" };
};
