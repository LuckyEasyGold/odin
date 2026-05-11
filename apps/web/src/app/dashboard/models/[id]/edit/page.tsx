import { PrismaClient } from "@prisma/client";
import { updateModel } from "@/app/actions/models";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const model = await prisma.model.findUnique({
    where: { id }
  });

  if (!model) notFound();
  if (model.createdBy !== session.user?.id) {
    return <div>Você não tem permissão para editar este modelo.</div>;
  }

  const updateWithId = updateModel.bind(null, id);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1e293b" }}>📝 Editar Modelo</h1>
          <p style={{ color: "#64748b" }}>Atualize as informações e o conteúdo do seu documento.</p>
        </div>
        <Link href="/dashboard" style={{ color: "#64748b", textDecoration: "none" }}>Cancelar</Link>
      </header>

      <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Nome do Modelo</label>
            <input 
              name="name" 
              defaultValue={model.name}
              required 
              style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontWeight: "bold", color: "#475569" }}>Categoria</label>
            <select name="category" defaultValue={model.category} style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <option value="Jurídico">Jurídico</option>
              <option value="Comercial">Comercial</option>
              <option value="RH">Recursos Humanos</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Descrição Curta</label>
          <input 
            name="description" 
            defaultValue={model.description || ""}
            required 
            style={{ padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontWeight: "bold", color: "#475569" }}>Corpo do Documento (Template)</label>
          <textarea 
            name="template" 
            defaultValue={model.template}
            required 
            rows={15}
            style={{ 
              padding: "1rem", 
              borderRadius: "12px", 
              border: "2px solid #e2e8f0", 
              fontFamily: "monospace",
              fontSize: "1rem",
              lineHeight: "1.5"
            }}
          />
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "1rem", 
          padding: "1rem", 
          backgroundColor: "#f8fafc", 
          borderRadius: "12px",
          border: "1px solid #e2e8f0"
        }}>
          <input 
            type="checkbox" 
            name="isPublic" 
            id="isPublic" 
            defaultChecked={model.isPublic}
            style={{ width: "20px", height: "20px", cursor: "pointer" }}
          />
          <label htmlFor="isPublic" style={{ cursor: "pointer" }}>
            <strong style={{ display: "block" }}>Modelo Público</strong>
            <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
              Controla se este modelo aparece na galeria geral.
            </span>
          </label>
        </div>

        <button type="submit" style={{ 
          padding: "1rem", 
          backgroundColor: "#2563eb", 
          color: "white", 
          border: "none", 
          borderRadius: "12px", 
          fontWeight: "bold", 
          fontSize: "1.1rem",
          cursor: "pointer"
        }}>
          💾 Salvar Alterações
        </button>
      </form>
    </div>
  );
}
