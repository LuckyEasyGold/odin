import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTranslation } from "@/locales";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const session = await auth();
  const t = getTranslation("pt");
  const models = await prisma.model.findMany({
    where: { isActive: true, isPublic: true },
    include: { category: true, creator: true },
    take: 6,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)", fontFamily: "system-ui, sans-serif" }}>
      {/* Navbar Premium removed - now using global Navbar */}

      <main style={{ padding: "4rem 5%", maxWidth: "1200px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1 style={{ color: "var(--foreground)", fontSize: "3rem", marginBottom: "1rem" }}>{t.common.title}</h1>
          <p style={{ color: "var(--muted)", fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
            {t.common.description}
          </p>
        </header>

        <section style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "3rem", 
          borderRadius: "24px", 
          boxShadow: "0 4px 6px -1px var(--shadow)",
          marginBottom: "4rem",
          border: "1px solid var(--card-border)"
        }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "var(--foreground)" }}>{t.home.hero.title}</h2>
          <p style={{ color: "var(--muted)", lineHeight: "1.6", marginBottom: "2rem" }}>{t.home.hero.description}</p>
          
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link
              href="/models"
              style={{
                padding: "0.8rem 2rem",
                backgroundColor: "#2563eb",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              {t.home.actions.browse}
            </Link>
          </div>
        </section>

        <section>
          <style dangerouslySetInnerHTML={{ __html: `
            .premium-card {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .premium-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 25px -5px var(--shadow) !important;
              border-color: var(--primary) !important;
            }
          `}} />
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--foreground)" }}>{t.home.popular.title}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {models.map((model: any) => (
              <div 
                key={model.id}
                className="premium-card"
                style={{ 
                  backgroundColor: "var(--card-bg)", 
                  color: "var(--foreground)",
                  padding: "2rem", 
                  borderRadius: "24px", 
                  border: "1px solid var(--card-border)",
                  boxShadow: "0 10px 15px -3px var(--shadow)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ 
                    color: "#2563eb", 
                    fontSize: "0.7rem", 
                    fontWeight: "800", 
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "rgba(37, 99, 235, 0.1)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px"
                  }}>
                    {model.category?.name || "Documento"}
                  </div>
                  {/* @ts-ignore */}
                  {model.compliance?.status === "verified" && (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "4px",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      color: "#0891b2",
                      background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "8px",
                      border: "1px solid #a5f3fc"
                    }}>
                      <span style={{ fontSize: "0.8rem" }}>🛡️</span> Verificado
                    </div>
                  )}
                </div>
                <Link href={`/models/${model.slug}`} style={{ textDecoration: "none" }}>
                  <h4 style={{ color: "var(--foreground)", margin: "0 0 0.75rem 0", fontSize: "1.25rem", fontWeight: "700" }}>{model.name}</h4>
                </Link>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0, lineHeight: "1.5", flex: 1 }}>{model.description}</p>

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

                <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
                  <span>v{model.version}</span>
                  <Link href={`/models/${model.slug}`} style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>Gerar Agora →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}