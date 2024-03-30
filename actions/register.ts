"use server";

import { RegisterFormValues, RegisterSchema } from "../schemas";

export const register = async (values: RegisterFormValues) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields" };
  }

  return { success: "Success" };
};
