import { PrismaClient } from "@prisma/client";
import ModelEditor from "./ModelEditor";

const prisma = new PrismaClient();

export default async function NewModelPage() {
  // Fetch main categories and their subcategories
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" }
  });

  // Fetch some existing models for import (limiting to 20 for UX)
  const rawModels = await prisma.model.findMany({
    where: { isPublic: true },
    take: 20,
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  // Serialize models to plain objects (important for Next.js 15)
  const existingModels = rawModels.map(m => ({
    ...m,
    price: Number(m.price),
    rating: Number(m.rating),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  return <ModelEditor categories={categories} existingModels={existingModels} />;
}
