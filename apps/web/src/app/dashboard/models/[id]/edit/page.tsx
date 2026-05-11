// @ts-ignore
import { PrismaClient } from "@prisma/client";
import { updateModel } from "@/app/actions/models";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
// @ts-ignore
import ModelForm from "./ModelForm";

const prisma = new PrismaClient();

export default async function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const [model, categories] = await Promise.all([
    prisma.model.findUnique({ where: { id }, include: { category: true } }),
    prisma.category.findMany({ where: { parentId: null }, include: { children: true }, orderBy: { name: "asc" } })
  ]);

  if (!model) notFound();
  if (model.createdBy !== session.user?.id) {
    return (
      <div style={{ padding: "2rem", color: "#ef4444", textAlign: "center" }}>
        Você não tem permissão para editar este modelo.
      </div>
    );
  }

  // Serialize model for the Client Component
  const serializedModel = {
    ...model,
    price: Number(model.price),
    rating: Number(model.rating),
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", color: "var(--foreground)" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--foreground)" }}>📝 Editar Modelo</h1>
          <p style={{ color: "var(--muted)" }}>Atualize as informações e o conteúdo do seu documento.</p>
        </div>
        <Link href="/dashboard" style={{ color: "var(--muted)", textDecoration: "none" }}>Cancelar</Link>
      </header>

      <ModelForm model={serializedModel} categories={categories} id={id} />
    </div>
  );
}
