import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isSpecialist: boolean;
      specialty: string | null;
      communityScore: number;
      communityLevel: number;
      communityTitle: string;
      canCurate: boolean;
      specialistValidatedByCommunity: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    isSpecialist: boolean;
    specialty: string | null;
    communityScore: number;
    communityLevel: number;
    communityTitle: string;
    canCurate: boolean;
    specialistValidatedByCommunity: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isSpecialist: boolean;
    specialty: string | null;
    communityScore: number;
    communityLevel: number;
    communityTitle: string;
    canCurate: boolean;
    specialistValidatedByCommunity: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    isSpecialist: boolean;
    specialty: string | null;
    communityScore: number;
    communityLevel: number;
    communityTitle: string;
    canCurate: boolean;
    specialistValidatedByCommunity: boolean;
  }
}

export {};
