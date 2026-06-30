import Link from "next/link";
import { getTranslation } from "@/locales";
import Wizard from "./Wizard";
import RatingSection from "./RatingSection";
import DeleteModelButton from "@/components/DeleteModelButton";
import { forkModel, verifyModel, deleteModel } from "@/app/actions/models";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getModel(slug: string) {
   try {
     return await prisma.model.findUnique({
       where: { slug, isActive: true },
       include: {
         category: true,
         creator: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } },
         ratings: {
           include: { user: { select: { fullName: true, username: true, isSpecialist: true, specialty: true } } },
           orderBy: { createdAt: "desc" }
         }
       }
     });
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
      padding: "clamp(0.75rem, 2vw, 2rem)", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      backgroundColor: "var(--background)", 
      color: "var(--foreground)",
      minHeight: "100vh"
    }}>
      <header style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <Link href="/models" style={{ color: "var(--muted)", textDecoration: "none", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            ← {t.models.back}
          </Link>
          <h1 style={{ 
            marginTop: "0.75rem", 
            marginBottom: "0.5rem",
            color: "var(--foreground)", 
            display: "flex", 
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "0.5rem",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)"
          }}>
            {model.name}
            {compliance?.status === "verified" && (
              <span style={{ 
                fontSize: "0.7rem", 
                backgroundColor: "rgba(8, 145, 178, 0.1)", 
                color: "#0891b2", 
                padding: "0.3rem 0.7rem", 
                borderRadius: "8px", 
                border: "1px solid rgba(8, 145, 178, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem"
              }}>
                🛡️ Verificado
              </span>
            )}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}>{model.description}</p>
          {compliance?.status === "verified" && (
            <p style={{ fontSize: "0.8rem", color: "#0891b2", marginTop: "0.5rem", padding: "0.75rem", backgroundColor: "rgba(8, 145, 178, 0.05)", borderRadius: "10px" }}>
              💡 Este modelo foi revisado tecnicamente e atende aos padrões de compliance do ODIN.
            </p>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {/* All action buttons use a uniform style */}
          {session?.user?.isSpecialist && compliance?.status !== "verified" && (
            <form action={async () => {
              "use server";
              await verifyModel(model.id);
            }}>
              <button type="submit" className="action-btn action-btn-verify">
                ✅ Verificar
              </button>
            </form>
          )}

          {session?.user?.id === model.createdBy && (
            <>
              <Link href={`/dashboard/models/${model.id}/edit`} className="action-btn action-btn-edit">
                ✏️ Editar Modelo
              </Link>
              <DeleteModelButton
                id={model.id}
                action={deleteModel}
                label="🗑️ Excluir"
                buttonStyle={{}}
                className="action-btn action-btn-delete"
              />
            </>
          )}

          <form action={async () => {
            "use server";
            await forkModel(model.id);
          }}>
            <button type="submit" className="action-btn action-btn-fork">
              🔱 Fork
            </button>
          </form>
        </div>
      </header>

      <Wizard model={model as any} />

      <RatingSection modelId={model.id} />
    </main>
  );
}
