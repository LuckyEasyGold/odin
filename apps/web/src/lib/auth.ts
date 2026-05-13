import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.email as string },
              { email: credentials.email as string },
            ]
          }
        });

        if (user && user.password) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (isPasswordValid) {
            return {
              id: user.id,
              name: user.fullName,
              image: user.avatarUrl,
              isSpecialist: user.isSpecialist,
              specialty: user.specialty,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isSpecialist = (user as any).isSpecialist;
        token.specialty = (user as any).specialty;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isSpecialist = token.isSpecialist;
        (session.user as any).specialty = token.specialty;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
