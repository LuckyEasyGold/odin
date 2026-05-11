import { PrismaClient } from "@prisma/client";
import type { Rating } from "@odin/core";

export class RatingRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    modelId: string;
    userId: string;
    rating: number;
    comment?: string;
    weight?: number;
  }): Promise<Rating> {
    return this.prisma.rating.create({
      data: {
        ...data,
        weight: data.weight ?? 1
      }
    });
  }

  async findById(id: string): Promise<Rating | null> {
    return this.prisma.rating.findUnique({ where: { id } });
  }

  async findByModelId(modelId: string): Promise<Rating[]> {
    return this.prisma.rating.findMany({ where: { modelId } });
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    return this.prisma.rating.findMany({ where: { userId } });
  }

  async exists(modelId: string, userId: string): Promise<boolean> {
    const count = await this.prisma.rating.count({
      where: { modelId, userId }
    });
    return count > 0;
  }
}