import crypto from "crypto";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { getPasswordResetTokenByUserEmail } from "../data/passwordResetToken";
import { getVerificationTokenByUserEmail } from "../data/verificationToken";
import { getTwoFactorTokenByUserEmail } from "../data/twoFactorToken";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

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

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingTwoFactorToken = await getTwoFactorTokenByUserEmail(email);
  if (existingTwoFactorToken) {
    await db.twoFactorVerificationToken.delete({
      where: { id: existingTwoFactorToken.id },
    });
  }

  const twoFactorVerificationToken = await db.twoFactorVerificationToken.create(
    {
      data: {
        email,
        token,
        expires,
      },
    }
  );

  return twoFactorVerificationToken;
};
