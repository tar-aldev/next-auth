"use server";

import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { NewPasswordFormValues, NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export const updateUserPassword = async (
  formValues: NewPasswordFormValues,
  resetPasswordToken: string | null
) => {
  if (!resetPasswordToken) {
    return {
      error: "No token!",
    };
  }

  const validatedFormValues = NewPasswordSchema.safeParse(formValues);
  if (!validatedFormValues.success) {
    return {
      error: "Invalid values!",
    };
  }
  const { password } = validatedFormValues.data;

  try {
    const existingPasswordResetToken = await getPasswordResetTokenByToken(
      resetPasswordToken
    );

    if (!existingPasswordResetToken) {
      return {
        error: "Invalid token",
      };
    }

    const hasExired = new Date(existingPasswordResetToken.expires) < new Date();

    if (hasExired) {
      return {
        error: "Token has expired",
      };
    }

    const existingUser = await getUserByEmail(existingPasswordResetToken.email);

    if (!existingUser) {
      return {
        error: "Email does not exist",
      };
    }

    const hashedPassword = await hash(password, 10);

    await db.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    await db.passwordResetToken.delete({
      where: { id: existingPasswordResetToken.id },
    });
  } catch (error) {
    console.log("error", error);

    return {
      error: "Something went wrong",
    };
  }

  return {
    success: "Password reset successful",
  };
};
