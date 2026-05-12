"use server"

// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function createWebhook(url: string, events: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  // Generate a random secret for HMAC
  const secret = `whsec_${crypto.randomBytes(24).toString("hex")}`;

  await prisma.webhook.create({
    data: {
      userId: session.user.id,
      url,
      events,
      secret,
      isActive: true
    }
  });

  revalidatePath("/dashboard/webhooks");
  return { success: true };
}

export async function deleteWebhook(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  await prisma.webhook.delete({
    where: { id, userId: session.user.id }
  });

  revalidatePath("/dashboard/webhooks");
  return { success: true };
}

export async function getMyWebhooks() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.webhook.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });
}
