// @ts-ignore
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getTranslation } from "@/locales";

const prisma = new PrismaClient();

export default async function ModelsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; category?: string; author?: string }> 
}) {
  const t = getTranslation("pt");
  const params = await searchParams;
  const { q, category, author } = params;

  const where: any = { isPublic: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }
    ];
  }
  if (category) where.categoryId = category;
  if (author) where.creator = { name: { contains: author, mode: "insensitive" } };

  const models = await prisma.model.findMany({
    where,
    include: { category: true, creator: true },
    orderBy: { createdAt: "desc" }
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" }
  });

  return (
    <main style={{ 
      padding: "3rem 2rem", 
      maxWidth: "1300px", 
      margin: "0 auto",
      minHeight: "100vh",
      backgroundColor: "var(--background)",
      color: "var(--foreground)"
    }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "var(--foreground)", marginBottom: "1rem" }}>
          Explorar Modelos
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--muted)", maxWidth: "700px", margin: "0 auto" }}>
          Encontre o documento perfeito entre milhares de modelos profissionais.
        </p>
      </header>

      {/* Barra de Busca e Filtros */}
      <section style={{ 
        backgroundColor: "var(--card-bg)", 
        padding: "2rem", 
        borderRadius: "24px", 
        boxShadow: "0 10px 15px -3px var(--shadow)",
        marginBottom: "3rem",
        border: "1px solid var(--card-border)"
      }}>
        <form style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.5fr", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "var(--muted)", marginBottom: "0.5rem" }}>Busca</label>
            <input 
              name="q" 
              defaultValue={q}
              placeholder="Ex: Contrato..." 
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)", fontSize: "1rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "var(--muted)", marginBottom: "0.5rem" }}>Categoria</label>
            <select 
              name="category" 
              defaultValue={category}
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)", fontSize: "1rem" }}
            >
              <option value="">Todas</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "var(--muted)", marginBottom: "0.5rem" }}>Autor</label>
            <input 
              name="author" 
              defaultValue={author}
              placeholder="Criador..." 
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid var(--card-border)", backgroundColor: "var(--background)", color: "var(--foreground)", fontSize: "1rem" }}
            />
          </div>
          <button type="submit" style={{ padding: "0.75rem", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}>
            Buscar
          </button>
        </form>
      </section>

      {/* Listagem de Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2.5rem" }}>
        {models.map((model: any) => (
          <Link
            key={model.id}
            href={`/models/${model.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem",
              borderRadius: "24px",
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 10px 15px -3px var(--shadow)",
              transition: "all 0.3s ease"
            }}
            className="model-card"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              .model-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 25px -5px var(--shadow);
                border-color: var(--primary);
              }
            `}} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(59, 130, 246, 0.1)", color: "var(--primary)", padding: "0.4rem 1rem", borderRadius: "100px", fontWeight: "700", textTransform: "uppercase" }}>
                {model.category?.name || "Geral"}
              </span>
              {model.isVerified && (
                <span title="Modelo validado por especialistas" style={{ fontSize: "0.75rem", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.4rem 0.75rem", borderRadius: "8px", fontWeight: "bold", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                  🛡️ Verificado
                </span>
              )}
            </div>
            <h3 style={{ margin: "0 0 1rem 0", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: "700" }}>{model.name}</h3>
            <p style={{ margin: 0, fontSize: "1rem", color: "var(--muted)", lineHeight: "1.6", flex: 1 }}>{model.description}</p>
            
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: "100%", height: "4px", backgroundColor: "var(--card-border)", borderRadius: "2px" }}>
                <div style={{ width: `${model.complianceScore}%`, height: "100%", backgroundColor: model.complianceScore > 70 ? "#10b981" : "#f59e0b", borderRadius: "2px" }}></div>
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--muted)", fontWeight: "bold" }}>{model.complianceScore}% Saúde Jurídica</span>
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "0.875rem" }}>
              <span>v{model.version}</span>
              <span style={{ color: "var(--primary)", fontWeight: "bold" }}>Gerar Agora →</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}