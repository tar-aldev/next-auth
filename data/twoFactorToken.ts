import { db } from "@/lib/db";

export const getTwoFactorTokenByUserEmail = async (email: string) => {
  try {
    const twoFactorVerificationToken =
      await db.twoFactorVerificationToken.findFirst({
        where: {
          email,
        },
      });

    return twoFactorVerificationToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorVerificationToken =
      await db.twoFactorVerificationToken.findUnique({
        where: {
          token,
        },
      });

    return twoFactorVerificationToken;
  } catch (error) {
    return null;
  }
};
