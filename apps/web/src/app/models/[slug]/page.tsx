import Link from "next/link";
import { getTranslation } from "@/locales";
import Wizard from "./Wizard";
import RatingSection from "./RatingSection";
import { forkModel, verifyModel } from "@/app/actions/models";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { ModelRepository } from "@odin/storage";

const prisma = new PrismaClient();
const modelRepo = new ModelRepository(prisma);

async function getModel(slug: string) {
  try {
    return await modelRepo.findBySlug(slug);
  } catch (error) {
    console.error("Error fetching model:", error);
    return null;
  }
}

export default async function ModelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTranslation("pt") as any;
  const session = await auth();
  const rawModel = await getModel(slug);
  
  if (!rawModel) {
    return (
      <main style={{ padding: "2rem", textAlign: "center", backgroundColor: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
        <h1>{t.models.empty}</h1>
        <Link href="/models" style={{ color: "var(--primary)" }}>{t.models.back}</Link>
      </main>
    );
  }

  // Serialize to plain object to handle Decimal fields from Prisma
  const model = JSON.parse(JSON.stringify(rawModel));
  const compliance = model.compliance as { status?: string } | null;

  return (
    <main style={{ 
      padding: "2rem", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      backgroundColor: "var(--background)", 
      color: "var(--foreground)",
      minHeight: "100vh"
    }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Link href="/models" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.9rem" }}>
            ← {t.models.back}
          </Link>
          <h1 style={{ marginTop: "1rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "1rem" }}>
            {model.name}
            {compliance?.status === "verified" && (
              <span style={{ 
                fontSize: "0.8rem", 
                backgroundColor: "rgba(8, 145, 178, 0.1)", 
                color: "#0891b2", 
                padding: "0.4rem 0.8rem", 
                borderRadius: "10px", 
                border: "1px solid rgba(8, 145, 178, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}>
                🛡️ Verificado por Especialistas
              </span>
            )}
          </h1>
          <p style={{ color: "var(--muted)" }}>{model.description}</p>
          {compliance?.status === "verified" && (
            <p style={{ fontSize: "0.85rem", color: "#0891b2", marginTop: "0.5rem" }}>
              💡 Este modelo foi revisado tecnicamente e atende aos padrões de compliance do ODIN.
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {/* Specialist Verification Button */}
          {session?.user?.isSpecialist && compliance?.status !== "verified" && (
            <form action={async () => {
              "use server";
              await verifyModel(model.id);
            }}>
              <button type="submit" style={{ 
                padding: "0.75rem 1.5rem", 
                backgroundColor: "#0891b2", 
                color: "white", 
                border: "none", 
                borderRadius: "12px", 
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 10px 15px -3px rgba(8, 145, 178, 0.3)"
              }}>
                ✅ Verificar Modelo (Specialist)
              </button>
            </form>
          )}

          <form action={async () => {
            "use server";
            await forkModel(model.id);
          }}>
            <button type="submit" style={{ 
              padding: "0.75rem 1.5rem", 
              backgroundColor: "var(--card-bg)", 
              color: "var(--foreground)", 
              border: "1px solid var(--card-border)", 
              borderRadius: "12px", 
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 6px var(--shadow)"
            }}>
              🔱 Fork (Criar minha versão)
            </button>
          </form>
        </div>
      </header>

      <Wizard model={model as any} />

      <RatingSection modelId={model.id} />
    </main>
  );
}
