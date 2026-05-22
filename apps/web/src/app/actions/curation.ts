"use server";

import { auth } from "@/lib/auth";
import { resolveCommunityProgress } from "@/lib/communityLevels";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitTechnicalReview(
  modelId: string,
  rating: number,
  comment: string,
  isApproval: boolean,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  // Check if user is a specialist
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const hasCurationPermission = !!user?.isSpecialist && !!user?.canCurate;
  if (!hasCurationPermission) {
    throw new Error(
      "Apenas especialistas com permissão de curadoria podem emitir pareceres técnicos.",
    );
  }

  // Create the review
  await prisma.rating.upsert({
    where: {
      modelId_userId: {
        modelId,
        userId: session.user.id,
      },
    },
    update: {
      rating,
      comment,
      isTechnical: true,
      isApproval,
    },
    create: {
      modelId,
      userId: session.user.id,
      rating,
      comment,
      isTechnical: true,
      isApproval,
    },
  });

  // If it's an approval, we mark the model as verified and update compliance score
  if (isApproval && rating >= 4) {
    await prisma.model.update({
      where: { id: modelId },
      data: {
        isVerified: true,
        complianceScore: { increment: 10 }, // Boosting compliance score
      },
    });
  }

  const pointsEarned = isApproval && rating >= 4 ? 30 : 10;
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: { communityScore: { increment: pointsEarned } },
    select: { communityScore: true },
  });

  const progress = resolveCommunityProgress(updatedUser.communityScore);

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      communityLevel: progress.level,
      communityTitle: progress.title,
      canCurate: progress.canCurate,
    },
  });

  revalidatePath(`/models/${modelId}`);
  revalidatePath("/models");
  return { success: true };
}

export async function setSpecialistStatus(
  userId: string,
  status: boolean,
  specialty: string,
  registrationId: string,
) {
  const session = await auth();
  // Simplified security: for now, any logged user can try (in prod this would be admin only)
  if (!session) throw new Error("Não autorizado");

  await prisma.user.update({
    where: { id: userId },
    data: {
      isSpecialist: status,
      specialty,
      registrationId,
      specialistValidatedByCommunity: status,
    },
  });

  revalidatePath("/dashboard");
}
