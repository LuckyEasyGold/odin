import { PrismaClient } from "@prisma/client";
import type { Model } from "@odin/core";

export class ModelRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<Model, "id" | "createdAt" | "updatedAt" | "rating" | "ratingCount" | "downloads" | "forks">): Promise<Model> {
    return this.prisma.model.create({
      data: {
        ...data,
        downloads: 0,
        forks: 0,
        rating: 0,
        ratingCount: 0
      }
    });
  }

  async findById(id: string): Promise<Model | null> {
    return this.prisma.model.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Model | null> {
    return this.prisma.model.findUnique({ where: { slug } });
  }

  async findAll(): Promise<Model[]> {
    return this.prisma.model.findMany({});
  }

  async update(id: string, data: Partial<Model>): Promise<Model> {
    return this.prisma.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.model.delete({ where: { id } });
  }

  async fork(id: string, newSlug: string): Promise<Model> {
    const original = await this.prisma.model.findUnique({ where: { id } });
    if (!original) throw new Error("Original model not found");

    return this.prisma.model.create({
      data: {
        ...original,
        id: undefined,
        slug: newSlug,
        name: `${original.name} (Fork)`,
        downloads: 0,
        forks: 0,
        rating: 0,
        ratingCount: 0,
        createdAt: undefined,
        updatedAt: undefined,
      } as any,
    });
  }

  async recalculateRating(id: string): Promise<void> {
    const ratings = await this.prisma.rating.findMany({
      where: { modelId: id },
      select: { rating: true },
    });

    if (ratings.length === 0) return;

    const total = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = total / ratings.length;

    await this.prisma.model.update({
      where: { id },
      data: {
        rating: average,
        ratingCount: ratings.length,
      },
    });
  }
}