"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsFormValues, SettingsSchema } from "@/schemas";
import { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";

// TODO: Check if it works
export const updateSettings = async (values: SettingsFormValues) => {
  const result = SettingsSchema.safeParse(values);

  if (!result.success) {
    return {
      error: "Invalid values",
    };
  }
  const { role, email, isTwoFactorEnabled, name, newPassword, password } =
    result.data;

  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const dbUser = await getUserById(currentUser.id);
  if (!dbUser) {
    return {
      error: "Unauthorized",
    };
  }

  const data: Partial<User> = {
    role,
  };

  if (!!email && !currentUser.isOAuth && email !== currentUser.email) {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { error: "User with given email already exists" };
    }
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Verification email sent",
    };
  }

  if (password && newPassword && dbUser.password && !currentUser.isOAuth) {
    const arePasswordsMatch = await compare(password, dbUser.password);
    if (!arePasswordsMatch) {
      return { error: "Incorrect password!" };
    }

    const hashedPassword = await hash(password, 10);
    data.password = hashedPassword;
  }

  if (!!name) {
    data.name = name;
  }

  if (typeof isTwoFactorEnabled === "boolean" && !currentUser.isOAuth) {
    data.isTwoFactorEnabled = isTwoFactorEnabled;
  }

  await db.user.update({
    where: { id: dbUser.id },
    data,
  });

  return {
    success: "Settings updated",
  };
};
