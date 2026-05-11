"use server"

import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createModel(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let categoryId = formData.get("category") as string;
  const template = formData.get("template") as string;
  const isPublic = formData.get("isPublic") === "on";

  // Handle custom category creation
  if (categoryId === "custom") {
    const newCatName = formData.get("newCategoryName") as string;
    const newCatDesc = formData.get("newCategoryDesc") as string;

    if (newCatName) {
      // Check if already exists to avoid duplication
      let category = await prisma.category.findUnique({ where: { name: newCatName } });
      if (!category) {
        category = await prisma.category.create({
          data: { name: newCatName, description: newCatDesc }
        });
      }
      categoryId = category.id;
    }
  }

  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  await prisma.model.create({
    data: {
      name,
      slug,
      description,
      categoryId: categoryId === "custom" || !categoryId ? null : categoryId,
      template,
      isPublic,
      isActive: true,
      createdBy: session.user.id,
      version: "1.0.0",
      schema: {},
      fields: {},
    }
  });

  revalidatePath("/models");
  redirect("/dashboard");
}

export async function updateModel(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("category") as string;
  const template = formData.get("template") as string;
  const isPublic = formData.get("isPublic") === "on";

  const model = await prisma.model.findUnique({ where: { id } });
  if (model?.createdBy !== session.user.id) throw new Error("Apenas o autor pode editar");

  await prisma.model.update({
    where: { id },
    data: { name, description, categoryId: categoryId || null, template, isPublic }
  });

  revalidatePath("/models");
  redirect("/dashboard");
}

export async function forkModel(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const original = await prisma.model.findUnique({ where: { id } });
  if (!original) throw new Error("Modelo não encontrado");

  const newModel = await prisma.model.create({
    data: {
      name: `${original.name} (Fork)`,
      slug: `${original.slug}-fork-${Date.now()}`,
      description: original.description,
      category: original.category,
      template: original.template,
      isPublic: false, // Forks start private by default
      isActive: true,
      createdBy: session.user.id,
      version: "1.0.0",
      schema: original.schema || {},
      fields: original.fields || {},
    }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/models/${newModel.id}/edit`);
}
