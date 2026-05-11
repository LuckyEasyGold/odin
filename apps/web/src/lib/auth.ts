import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // In Phase 3 MVP, we simplify. 
        // We look for a user with this email or username.
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.email as string },
              // In the current schema, 'email' is not yet present. 
              // We will use 'username' as the primary login field for now.
            ]
          }
        });

        if (user) {
          // For now, any user that exists can log in (demo mode)
          return {
            id: user.id,
            name: user.fullName,
            image: user.avatarUrl,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
