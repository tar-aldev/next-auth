import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { getPasswordResetTokenByUserEmail } from "../data/passwordResetToken";
import { getVerificationTokenByUserEmail } from "../data/verificationToken";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByUserEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingPasswordResetToken = await getPasswordResetTokenByUserEmail(
    email
  );
  if (existingPasswordResetToken) {
    await db.passwordResetToken.delete({
      where: { id: existingPasswordResetToken.id },
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
