import { authConfig } from "@/auth.config";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { Adapter } from "next-auth/adapters";
import "next-auth/jwt";
import { getTwoFactorConfirmationByUserId } from "./data/twoFactorConfirmation";
import { getAccountByUserId } from "@/data/account";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    role: UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole;
    isTwoFactorEnabled?: boolean;
    isOAuth?: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider !== "credentials") {
        return true;
      }

      if (!user.id) {
        return false;
      }

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) {
          return false;
        }

        // Delete two factor confirmation on next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    jwt: async ({ token }) => {
      if (!token.sub) {
        return token;
      }

      const user = await getUserById(token.sub);
      if (!user) return token;
      const existingAccount = await getAccountByUserId(user.id);

      token.isOAuth = !!existingAccount;
      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
    session: async ({ token, session }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      if (typeof token.isTwoFactorEnabled !== undefined && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email && (token.email = token.email);
        session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
  },
  events: {
    linkAccount: async ({ user }) => {
      if (!user?.id) {
        return;
      }
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  ...authConfig,
});
