import { PrismaClient } from "@prisma/client";

export class GenerationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    id?: string;
    modelId: string;
    userId?: string;
    inputs: any;
    outputHtml?: string;
    documentHash?: string;
    status?: string;
    signatureStatus?: string;
    externalSignatureId?: string;
    signers?: { name: string; email: string; order?: number }[];
  }) {
    const { signers, ...rest } = data;
    return this.prisma.generation.create({
      data: {
        ...rest,
        signers: signers
          ? {
              create: signers,
            }
          : undefined,
      },
      include: {
        model: true,
        signers: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.generation.findUnique({
      where: { id },
      include: {
        model: true,
        signers: true,
      },
    });
  }

  async findByModelId(modelId: string) {
    return this.prisma.generation.findMany({
      where: { modelId },
      include: { signers: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        model: true,
        signers: true,
      },
    });
  }
}