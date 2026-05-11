import { PrismaClient } from "@prisma/client";

export class ModelRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.model.findMany({
      where: { isActive: true },
      include: { 
        category: true,
        creator: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.model.findUnique({
      where: { id },
      include: { 
        category: true,
        creator: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } },
        ratings: {
          include: { user: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.model.findUnique({
      where: { slug },
      include: { 
        category: true,
        creator: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } },
        ratings: {
          include: { user: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  }

  async create(data: any) {
    return this.prisma.model.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.model.update({ where: { id }, data });
  }

  async recalculateRating(id: string) {
    const ratings = await this.prisma.rating.findMany({ where: { modelId: id } });
    if (ratings.length === 0) return;

    const total = ratings.reduce((acc, r) => acc + (r.rating * Number(r.weight)), 0);
    const count = ratings.length;
    const avg = total / count;

    await this.prisma.model.update({
      where: { id },
      data: {
        rating: avg,
        ratingCount: count
      }
    });
  }

  async fork(id: string, newSlug: string) {
    const original = await this.findById(id);
    if (!original) throw new Error("Original model not found");

    const { id: _, slug: __, createdAt: ___, updatedAt: ____, ratings: _____, ...data } = original;
    return this.prisma.model.create({
      data: {
        ...data,
        slug: newSlug,
        categoryId: original.categoryId, // Ensure relation
        creator: undefined, // Will be set by caller
        createdBy: "SYSTEM_FORK" // Placeholder
      } as any
    });
  }
}