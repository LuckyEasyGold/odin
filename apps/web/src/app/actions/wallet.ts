"use server"

// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function getMyBalance() {
  const session = await auth();
  if (!session?.user?.id) return 0;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true }
  });

  return Number(user?.balance || 0);
}

export async function getMyTransactions() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50
  });
}
