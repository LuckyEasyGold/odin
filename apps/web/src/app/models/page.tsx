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
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.2s",
              }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#2563eb" }}>{model.name}</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>{model.description}</p>
              <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#999" }}>v{model.version}</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}