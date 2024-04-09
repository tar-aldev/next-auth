"use server";
import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "../data/verificationToken";
import { getUserByEmail } from "../data/user";

export const verifyToken = async (token: string | null) => {
  if (!token) {
    return {
      error: "Cannot confirm verification token. Is it valid?",
    };
  }

  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return {
      error: "Token does not exist",
    };
  }

  const hasExired = new Date(existingToken.expires) < new Date();

  if (hasExired) {
    return {
      error: "Token has expired",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "Email does not exist",
    };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return {
    success: "Email verified",
  };
};
