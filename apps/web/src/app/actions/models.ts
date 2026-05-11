"use server"

// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function handleCategory(categoryId: string, formData: FormData) {
  if (categoryId === "custom") {
    const newCatName = formData.get("newCategoryName") as string;
    const newCatDesc = formData.get("newCategoryDesc") as string;

    if (newCatName) {
      let category = await prisma.category.findUnique({ where: { name: newCatName } });
      if (!category) {
        category = await prisma.category.create({
          data: { name: newCatName, description: newCatDesc || "" }
        });
      }
      return category.id;
    }
  }
  return categoryId === "custom" || !categoryId ? null : categoryId;
}

export async function createModel(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const template = formData.get("template") as string;
  const isPublic = formData.get("isPublic") === "on";
  
  const categoryId = await handleCategory(formData.get("category") as string, formData);
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") + "-" + Date.now();

  await prisma.model.create({
    data: {
      name,
      slug,
      description,
      categoryId,
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
  const template = formData.get("template") as string;
  const isPublic = formData.get("isPublic") === "on";

  const categoryId = await handleCategory(formData.get("category") as string, formData);

  const model = await prisma.model.findUnique({ where: { id } });
  if (model?.createdBy !== session.user.id) throw new Error("Apenas o autor pode editar");

  await prisma.model.update({
    where: { id },
    data: { name, description, categoryId, template, isPublic }
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
      categoryId: original.categoryId, // Fixed: use ID field
      template: original.template,
      isPublic: false,
      isActive: true,
      createdBy: session.user.id,
      version: "1.0.0",
      schema: (original.schema as any) || {},
      fields: (original.fields as any) || {},
    }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/models/${newModel.id}/edit`);
}
