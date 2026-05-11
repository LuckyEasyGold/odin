import { PrismaClient } from "@prisma/client";
import type { Generation } from "@odin/core";

export class GenerationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    modelId: string;
    userId?: string;
    inputs: any;
    outputHtml?: string;
    documentHash?: string;
    status?: string;
  }) {
    return this.prisma.generation.create({
      data,
      include: { model: true }
    });
  }

  async findById(id: string): Promise<any | null> {
    return this.prisma.generation.findUnique({ 
      where: { id },
      include: { model: true }
    });
  }

  async findByModelId(modelId: string): Promise<Generation[]> {
    return this.prisma.generation.findMany({ where: { modelId } });
  }

  async findByUserId(userId: string): Promise<Generation[]> {
    return this.prisma.generation.findMany({ 
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { model: true }
    }) as any;
  }
}