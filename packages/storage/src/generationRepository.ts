import { PrismaClient } from "@prisma/client";
import type { Generation } from "@odin/core";

export class GenerationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    modelId: string;
    userId?: string;
    inputs: Record<string, unknown>;
    outputHtml?: string;
    outputPdfUrl?: string;
    outputJson?: Record<string, unknown>;
    checksum?: string;
  }): Promise<Generation> {
    return this.prisma.generation.create({ data });
  }

  async findById(id: string): Promise<Generation | null> {
    return this.prisma.generation.findUnique({ where: { id } });
  }

  async findByModelId(modelId: string): Promise<Generation[]> {
    return this.prisma.generation.findMany({ where: { modelId } });
  }

  async findByUserId(userId: string): Promise<Generation[]> {
    return this.prisma.generation.findMany({ where: { userId } });
  }
}