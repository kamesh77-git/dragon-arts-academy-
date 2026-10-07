import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

// Break-glass allowlist: these emails are always "admin", so a bad row or
// an empty users table can never lock the owner out.
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },

  providers: [
    ...(googleEnabled
      ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET })]
      : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user?.passwordHash) return null;
        if (!(await bcrypt.compare(password, user.passwordHash))) return null;

        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],

  callbacks: {
    // Google sign-in is only for people already on the team (or the
    // allowlist); anyone else with a Google account is turned away.
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (adminEmails.includes(email)) return true;
      const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
      return Boolean(existing);
    },

    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.toLowerCase();
      if (!email) return token;

      const dbUser = await db.query.users.findFirst({ where: eq(users.email, email) });
      const allowlisted = adminEmails.includes(email);
      if (dbUser) {
        token.userId = dbUser.id;
        token.role = allowlisted ? "admin" : dbUser.role;
        token.name = dbUser.name ?? token.name;
      } else if (allowlisted) {
        token.userId = undefined;
        token.role = "admin";
      } else {
        // Account deleted since this token was issued: drop its access.
        token.userId = undefined;
        token.role = undefined;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string | undefined) ?? "";
        session.user.role = token.role as "admin" | "staff" | undefined;
      }
      return session;
    },
  },

  pages: { signIn: "/admin/login" },
});
