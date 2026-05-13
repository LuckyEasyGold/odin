import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isSpecialist: boolean
      specialty: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    isSpecialist: boolean
    specialty: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    isSpecialist: boolean
    specialty: string | null
  }
}
