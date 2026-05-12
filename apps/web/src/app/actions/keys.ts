"use server"

// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function generateApiKey(name: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  // Generate a random key (odin_...)
  const rawKey = `odin_${crypto.randomBytes(24).toString("hex")}`;
  
  // Hash the key for database storage
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

  await prisma.apiKey.create({
    data: {
      userId: session.user.id,
      name,
      keyHash,
      isActive: true
    }
  });

  revalidatePath("/dashboard/keys");
  
  // Return the raw key ONLY once. It won't be stored.
  return { success: true, key: rawKey };
}

export async function revokeApiKey(keyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  // Security check: must own the key
  const key = await prisma.apiKey.findUnique({ where: { id: keyId } });
  if (key?.userId !== session.user.id) throw new Error("Não autorizado");

  await prisma.apiKey.delete({
    where: { id: keyId }
  });

  revalidatePath("/dashboard/keys");
  return { success: true };
}

export async function getMyKeys() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });
}
