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
  specialistValidatedByCommunity?: boolean;
};

type SessionTokenExtras = {
  id: string;
  isSpecialist: boolean;
  specialty: string | null;
  communityScore: number;
  communityLevel: number;
  communityTitle: string;
  canCurate: boolean;
  specialistValidatedByCommunity: boolean;
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
              specialistValidatedByCommunity:
                user.specialistValidatedByCommunity,
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
        token.specialistValidatedByCommunity =
          enriched.specialistValidatedByCommunity ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionToken = token as typeof token & SessionTokenExtras;
        session.user.id = sessionToken.id;
        session.user.isSpecialist = sessionToken.isSpecialist;
        session.user.specialty = sessionToken.specialty;
        session.user.communityScore = sessionToken.communityScore;
        session.user.communityLevel = sessionToken.communityLevel;
        session.user.communityTitle = sessionToken.communityTitle;
        session.user.canCurate = sessionToken.canCurate;
        session.user.specialistValidatedByCommunity =
          sessionToken.specialistValidatedByCommunity;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
