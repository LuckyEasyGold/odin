import Link from "next/link";
import { getTranslation } from "@/locales";
import Wizard from "./Wizard";
import RatingSection from "./RatingSection";
import { forkModel } from "@/app/actions/models";

async function getModel(slug: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/v1/models/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTranslation("pt");
  const model = await getModel(slug);

  if (!model) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>{t.models.empty}</h1>
        <Link href="/models">{t.models.back}</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Link href="/models" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
            ← {t.models.back}
          </Link>
          <h1 style={{ marginTop: "1rem" }}>{model.name}</h1>
          <p style={{ color: "#666" }}>{model.description}</p>
        </div>

        <form action={async () => {
          "use server";
          await forkModel(model.id);
        }}>
          <button type="submit" style={{ 
            padding: "0.75rem 1.5rem", 
            backgroundColor: "#f1f5f9", 
            color: "#1e293b", 
            border: "1px solid #e2e8f0", 
            borderRadius: "12px", 
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            🔱 Fork (Criar minha versão)
          </button>
        </form>
      </header>

      <Wizard model={model} />

      <RatingSection modelId={model.id} />
    </main>
  );
}
