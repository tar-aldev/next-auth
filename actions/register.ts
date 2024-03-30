"use server";

import { hash } from "bcryptjs";
import { RegisterFormValues, RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: RegisterFormValues) => {
  const validatedValues = RegisterSchema.safeParse(values);
  if (!validatedValues.success) {
    return { error: "Invalid fields" };
  }
  const { email, name, password } = validatedValues.data;

  const hashedPassword = await hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await db.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  // TODO: send verification

  return { success: "Account created" };
};
