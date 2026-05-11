import Link from "next/link";
import { getTranslation } from "@/locales";
import Wizard from "./Wizard";
import RatingSection from "./RatingSection";

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
      <header style={{ marginBottom: "2rem" }}>
        <Link href="/models" style={{ color: "#666", textDecoration: "none", fontSize: "0.9rem" }}>
          ← {t.models.back}
        </Link>
        <h1 style={{ marginTop: "1rem" }}>{model.name}</h1>
        <p style={{ color: "#666" }}>{model.description}</p>
      </header>

      <Wizard model={model} />

      <RatingSection modelId={model.id} />
    </main>
  );
}
