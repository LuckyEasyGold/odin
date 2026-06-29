// @ts-ignore
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getTranslation } from "@/locales";

const prisma = new PrismaClient();

export default async function ModelsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; author?: string; view?: string }>
}) {
  const t = getTranslation("pt");
  const params = await searchParams;
  const { q, category, author, view } = params;
  const listMode = view === "list";

  const where: any = { isPublic: true };
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } }
    ];
  }
  if (category) where.categoryId = category;
  if (author) where.creator = {
    OR: [
      { username: { contains: author, mode: "insensitive" } },
      { fullName: { contains: author, mode: "insensitive" } }
    ]
  };

  const rawModels = await prisma.model.findMany({
    where,
    include: { category: true, creator: true },
    orderBy: { createdAt: "desc" }
  });

  const models = JSON.parse(JSON.stringify(rawModels));

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" }
  });

  // Helper to preserve search params while toggling view
  const buildViewUrl = (newView: string) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (author) sp.set("author", author);
    if (newView !== "cards") sp.set("view", newView);
    const qs = sp.toString();
    return `/models${qs ? `?${qs}` : ""}`;
  };

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
        marginBottom: "2rem",
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

      {/* View Toggle + Count */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        gap: "1rem"
      }}>
        <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          {models.length} modelo{models.length !== 1 ? "s" : ""} encontrado{models.length !== 1 ? "s" : ""}
        </span>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={buildViewUrl("cards")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
              backgroundColor: !listMode ? "var(--primary)" : "var(--card-bg)",
              color: !listMode ? "white" : "var(--muted)",
              border: !listMode ? "none" : "1px solid var(--card-border)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1" />
              <rect x="9" y="1" width="6" height="6" rx="1" />
              <rect x="1" y="9" width="6" height="6" rx="1" />
              <rect x="9" y="9" width="6" height="6" rx="1" />
            </svg>
            Cards
          </Link>
          <Link
            href={buildViewUrl("list")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.2s",
              backgroundColor: listMode ? "var(--primary)" : "var(--card-bg)",
              color: listMode ? "white" : "var(--muted)",
              border: listMode ? "none" : "1px solid var(--card-border)"
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="14" height="3" rx="1" />
              <rect x="1" y="6.5" width="14" height="3" rx="1" />
              <rect x="1" y="12" width="14" height="3" rx="1" />
            </svg>
            Lista
          </Link>
        </div>
      </div>

      {/* ─── VIEW: CARDS ─── */}
      {!listMode && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2.5rem" }}>
          {models.map((model: any) => (
            <div
              key={model.id}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "2rem",
                borderRadius: "24px",
                color: "var(--foreground)",
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
              <Link href={`/models/${model.slug}`} style={{ textDecoration: "none" }}>
                <h3 style={{ margin: "0 0 1rem 0", color: "var(--foreground)", fontSize: "1.5rem", fontWeight: "700" }}>{model.name}</h3>
              </Link>
              <p style={{ margin: 0, fontSize: "1rem", color: "var(--muted)", lineHeight: "1.6", flex: 1 }}>{model.description}</p>

              <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <Link
                  href={`/models?author=${encodeURIComponent(model.creator?.username || "")}`}
                  style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: "700", fontSize: "0.95rem" }}
                >
                  {model.creator?.fullName || model.creator?.username || "Autor"}
                </Link>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  background: Number(model.price || 0) > 0 ? "rgba(252, 165, 165, 0.2)" : "rgba(187, 247, 208, 0.2)",
                  color: Number(model.price || 0) > 0 ? "#b91c1c" : "#15803d",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "9999px",
                  border: Number(model.price || 0) > 0 ? "1px solid rgba(248, 113, 113, 0.3)" : "1px solid rgba(134, 239, 172, 0.3)"
                }}>
                  {Number(model.price || 0) > 0 ? "Pago" : "Open"}
                </span>
              </div>

              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", color: "var(--muted)", fontSize: "0.875rem" }}>
                <span>v{model.version}</span>
                <Link href={`/models/${model.slug}`} style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>Ver Modelo →</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── VIEW: LIST ─── */}
      {listMode && (
        <div style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 20px var(--shadow)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--card-border)", backgroundColor: "var(--background)" }}>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "700", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Modelo</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "700", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }} className="hide-mobile">Categoria</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "left", fontWeight: "700", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Autor</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "center", fontWeight: "700", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Preço</th>
                <th style={{ padding: "1rem 1.25rem", textAlign: "right", fontWeight: "700", color: "var(--muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Versão</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model: any) => (
                <tr
                  key={model.id}
                  style={{
                    borderBottom: "1px solid var(--card-border)",
                    transition: "background 0.15s",
                  }}
                  className="model-list-row"
                >
                  <style dangerouslySetInnerHTML={{ __html: `
                    .model-list-row:hover { background: rgba(59, 130, 246, 0.03); }
                  `}} />
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div>
                      <Link
                        href={`/models/${model.slug}`}
                        style={{ fontWeight: "700", color: "var(--foreground)", textDecoration: "none", display: "block", marginBottom: "0.25rem" }}
                      >
                        {model.name}
                        {model.isVerified && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#10b981" }}>🛡️</span>}
                      </Link>
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {model.description}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.85rem" }} className="hide-mobile">
                    {model.category?.name || "Geral"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                    {model.creator?.fullName || model.creator?.username || "—"}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "center" }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      background: Number(model.price || 0) > 0 ? "rgba(252, 165, 165, 0.2)" : "rgba(187, 247, 208, 0.2)",
                      color: Number(model.price || 0) > 0 ? "#b91c1c" : "#15803d",
                    }}>
                      {Number(model.price || 0) > 0 ? `R$ ${model.price}` : "Grátis"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right", fontSize: "0.85rem", color: "var(--muted)" }}>
                    v{model.version}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {models.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--muted)" }}>
          <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📭</span>
          <p>Nenhum modelo encontrado com esses filtros.</p>
        </div>
      )}
    </main>
  );
}
