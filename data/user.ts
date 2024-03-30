import { db } from "@/lib/db";

export const getUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};

export const getUserById = (id: string) => {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};
