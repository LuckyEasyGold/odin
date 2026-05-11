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

  // Build filters dynamically
  const where: any = { isPublic: true };
  
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }
    ];
  }
  
  if (category) {
    where.categoryId = category;
  }
  
  if (author) {
    where.creator = { name: { contains: author, mode: "insensitive" } };
  }

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
      background: "radial-gradient(circle at top right, #f8fafc 0%, #ffffff 100%)"
    }}>
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
          Explorar Modelos
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#64748b", maxWidth: "700px", margin: "0 auto" }}>
          Encontre o documento perfeito entre milhares de modelos profissionais.
        </p>
      </header>

      {/* Barra de Busca e Filtros */}
      <section style={{ 
        backgroundColor: "white", 
        padding: "2rem", 
        borderRadius: "24px", 
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
        marginBottom: "3rem",
        border: "1px solid #f1f5f9"
      }}>
        <form style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 0.5fr", gap: "1rem", alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#475569", marginBottom: "0.5rem" }}>O que você procura?</label>
            <input 
              name="q" 
              defaultValue={q}
              placeholder="Ex: Contrato de aluguel, Recibo..." 
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#475569", marginBottom: "0.5rem" }}>Categoria</label>
            <select 
              name="category" 
              defaultValue={category}
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem" }}
            >
              <option value="">Todas</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: "#475569", marginBottom: "0.5rem" }}>Autor</label>
            <input 
              name="author" 
              defaultValue={author}
              placeholder="Nome do criador..." 
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "1rem" }}
            />
          </div>
          <button type="submit" style={{ 
            padding: "0.75rem", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1rem"
          }}>
            Buscar
          </button>
        </form>
        {(q || category || author) && (
          <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#3b82f6" }}>
            <Link href="/models" style={{ textDecoration: "none", color: "inherit", fontWeight: "600" }}>✕ Limpar Filtros</Link>
          </div>
        )}
      </section>

      {/* Listagem de Cards */}
      {models.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem", backgroundColor: "#f8fafc", borderRadius: "24px", border: "2px dashed #e2e8f0" }}>
          <span style={{ fontSize: "3rem" }}>🔍</span>
          <h3 style={{ marginTop: "1rem", color: "#1e293b" }}>Nenhum modelo encontrado</h3>
          <p style={{ color: "#64748b" }}>Tente ajustar seus filtros ou use palavras-chave diferentes.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
          gap: "2.5rem" 
        }}>
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
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative"
              }}
              className="model-card"
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .model-card:hover {
                  transform: translateY(-8px);
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
                  border-color: #3b82f6;
                }
              `}} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ 
                  fontSize: "0.75rem", 
                  background: "#eff6ff", 
                  color: "#2563eb", 
                  padding: "0.4rem 1rem", 
                  borderRadius: "100px",
                  fontWeight: "700",
                  textTransform: "uppercase"
                }}>
                  {model.category?.name || "Sem Categoria"}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>
                  Por: {model.creator?.name || "Odin"}
                </span>
              </div>

              <h3 style={{ 
                margin: "0 0 1rem 0", 
                color: "#1e293b", 
                fontSize: "1.5rem",
                fontWeight: "700"
              }}>
                {model.name}
              </h3>
              
              <p style={{ 
                margin: 0, 
                fontSize: "1rem", 
                color: "#64748b", 
                lineHeight: "1.6",
                flex: 1
              }}>
                {model.description}
              </p>

              <div style={{ 
                marginTop: "2rem", 
                paddingTop: "1.5rem", 
                borderTop: "1px solid #f1f5f9",
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                  v{model.version}
                </div>
                <div style={{ color: "#3b82f6", fontWeight: "bold" }}>Gerar Agora →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}