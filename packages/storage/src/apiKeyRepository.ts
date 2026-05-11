import { PrismaClient } from "@prisma/client";
import type { ApiKey } from "@odin/core";
import crypto from "crypto";

export class ApiKeyRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: {
    userId: string;
    name: string;
    rateLimitPerHour?: number;
  }): Promise<{ apiKey: ApiKey; rawKey: string }> {
    const rawKey = `odin_${crypto.randomBytes(32).toString("hex")}`;
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const apiKey = await this.prisma.apiKey.create({
      data: {
        userId: data.userId,
        name: data.name,
        keyHash,
        rateLimitPerHour: data.rateLimitPerHour ?? 1000
      }
    });

    return { apiKey, rawKey };
  }

  async findById(id: string): Promise<ApiKey | null> {
    return this.prisma.apiKey.findUnique({ where: { id } });
  }

  async findByUserId(userId: string): Promise<ApiKey[]> {
    return this.prisma.apiKey.findMany({ where: { userId } });
  }

  async findByKey(key: string): Promise<ApiKey | null> {
    const keyHash = crypto.createHash("sha256").update(key).digest("hex");
    return this.prisma.apiKey.findFirst({ where: { keyHash } });
  }

  async updateLastUsed(id: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: { id },
      data: { lastUsedAt: new Date() }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.apiKey.delete({ where: { id } });
  }
}