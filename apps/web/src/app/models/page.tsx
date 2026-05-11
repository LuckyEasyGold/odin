import Link from "next/link";
import { getTranslation } from "@/locales";

async function getModels() {
  try {
    const res = await fetch("http://localhost:3001/api/v1/models", { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ModelsPage() {
  const t = getTranslation("pt");
  const models = await getModels();

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <Link href="/" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
          ← {t.models.back}
        </Link>
        <h1 style={{ marginTop: "1rem" }}>{t.models.title}</h1>
        <p style={{ color: "#666" }}>{t.models.description}</p>
      </header>

      {models.length === 0 ? (
        <p>{t.models.empty}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {models.map((model: any) => (
            <Link
              key={model.id}
              href={`/models/${model.slug}`}
              style={{
                display: "block",
                padding: "1.5rem",
                border: "1px solid #eee",
                borderRadius: "12px",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s",
                backgroundColor: "white",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                <span style={{ 
                  fontSize: "0.7rem", 
                  backgroundColor: "#eff6ff", 
                  color: "#2563eb", 
                  padding: "0.25rem 0.5rem", 
                  borderRadius: "9999px",
                  fontWeight: "bold",
                  textTransform: "uppercase"
                }}>
                  {model.category}
                </span>
                {model.compliance?.status === "verified" && (
                  <span title="Verificado" style={{ color: "#10b981" }}>✅</span>
                )}
              </div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#1e293b", fontSize: "1.25rem" }}>{model.name}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#64748b", lineHeight: "1.5" }}>{model.description}</p>
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>v{model.version}</div>
                <div style={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: "bold" }}>Ver Detalhes →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}