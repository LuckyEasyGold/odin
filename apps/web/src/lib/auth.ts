import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();

type AuthUserExtras = {
  isSpecialist?: boolean;
  specialty?: string | null;
  communityScore?: number;
  communityLevel?: number;
  communityTitle?: string;
  canCurate?: boolean;
};

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
            ],
          },
        });

        if (user?.password) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (isPasswordValid) {
            return {
              id: user.id,
              name: user.fullName,
              image: user.avatarUrl,
              isSpecialist: user.isSpecialist,
              specialty: user.specialty,
              communityScore: user.communityScore,
              communityLevel: user.communityLevel,
              communityTitle: user.communityTitle,
              canCurate: user.canCurate,
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
        const enriched = user as typeof user & AuthUserExtras;
        token.id = user.id;
        token.isSpecialist = enriched.isSpecialist ?? false;
        token.specialty = enriched.specialty ?? null;
        token.communityScore = enriched.communityScore ?? 0;
        token.communityLevel = enriched.communityLevel ?? 1;
        token.communityTitle =
          enriched.communityTitle ?? "Aprendiz de Curadoria";
        token.canCurate = enriched.canCurate ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.isSpecialist = token.isSpecialist;
        session.user.specialty = token.specialty;
        session.user.communityScore = token.communityScore;
        session.user.communityLevel = token.communityLevel;
        session.user.communityTitle = token.communityTitle;
        session.user.canCurate = token.canCurate;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
