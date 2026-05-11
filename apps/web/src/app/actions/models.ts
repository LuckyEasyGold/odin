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
  const category = formData.get("category") as string;
  const template = formData.get("template") as string;
  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  await prisma.model.create({
    data: {
      name,
      slug,
      description,
      category,
      template,
      isActive: true,
      createdBy: session.user.id,
      version: "1.0.0", // Required in current schema
      schema: {},       // Required in current schema
      fields: {},       // Required in current schema
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
  const category = formData.get("category") as string;
  const template = formData.get("template") as string;

  const model = await prisma.model.findUnique({ where: { id } });
  if (model?.createdBy !== session.user.id) throw new Error("Apenas o autor pode editar");

  await prisma.model.update({
    where: { id },
    data: { name, description, category, template }
  });

  revalidatePath("/models");
  redirect("/dashboard");
}
