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
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <div className="page-container">
        {/* Hero Section */}
        <header style={{ 
          textAlign: "center", 
          marginBottom: "clamp(2rem, 5vw, 4rem)",
          paddingTop: "clamp(1rem, 2vw, 2rem)"
        }}>
          <div style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)", marginBottom: "0.5rem", lineHeight: 1 }}>🔱</div>
          <h1 style={{ 
            color: "var(--foreground)", 
            fontSize: "clamp(2rem, 6vw, 3.5rem)", 
            marginBottom: "0.75rem",
            fontWeight: "900",
            letterSpacing: "-0.02em"
          }}>
            {t.common.title}
          </h1>
          <p style={{ 
            color: "var(--muted)", 
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)", 
            maxWidth: "600px", 
            margin: "0 auto",
            lineHeight: "1.7"
          }}>
            {t.common.description}
          </p>
        </header>

        {/* CTA Section */}
        <section style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "clamp(1.5rem, 4vw, 3rem)", 
          borderRadius: "var(--radius-xl)", 
          boxShadow: "0 4px 6px -1px var(--shadow)",
          marginBottom: "clamp(2rem, 5vw, 4rem)",
          border: "1px solid var(--card-border)",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "clamp(1.35rem, 3.5vw, 2rem)", marginBottom: "1rem", color: "var(--foreground)" }}>{t.home.hero.title}</h2>
          <p style={{ color: "var(--muted)", lineHeight: "1.7", marginBottom: "1.5rem", maxWidth: "500px", marginLeft: "auto", marginRight: "auto" }}>{t.home.hero.description}</p>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/models"
              className="btn-primary"
            >
              {t.home.actions.browse}
            </Link>
            <Link
              href="/docs"
              className="btn-secondary"
            >
              Documentação
            </Link>
          </div>
        </section>

        {/* Popular Models Grid */}
        <section>
          <h3 style={{ 
            fontSize: "clamp(1.25rem, 3vw, 1.5rem)", 
            marginBottom: "1.5rem", 
            color: "var(--foreground)" 
          }}>
            {t.home.popular.title}
          </h3>
          <div className="card-grid" style={{ 
            display: "grid", 
            gap: "clamp(1rem, 2vw, 2rem)" 
          }}>
            {models.map((model: any) => (
              <div 
                key={model.id}
                className="card"
                style={{ 
                  padding: "clamp(1.25rem, 2.5vw, 2rem)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  animation: "slideUp 0.4s ease forwards",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div style={{ 
                    color: "var(--primary)", 
                    fontSize: "0.65rem", 
                    fontWeight: "800", 
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "var(--primary-light)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "var(--radius-full)"
                  }}>
                    {model.category?.name || "Documento"}
                  </div>
                  {model.compliance?.status === "verified" && (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "4px",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      color: "#0891b2",
                      background: "linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "8px",
                      border: "1px solid #a5f3fc"
                    }}>
                      🛡️ Verificado
                    </div>
                  )}
                </div>
                <Link href={`/models/${model.slug}`} style={{ textDecoration: "none" }}>
                  <h4 style={{ color: "var(--foreground)", margin: "0 0 0.75rem 0", fontSize: "1.15rem", fontWeight: "700" }}>{model.name}</h4>
                </Link>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0, lineHeight: "1.6", flex: 1 }}>{model.description}</p>

                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <Link
                    href={`/models?author=${encodeURIComponent(model.creator?.username || "")}`}
                    style={{ color: "var(--primary)", textDecoration: "underline", fontWeight: "700", fontSize: "0.85rem" }}
                  >
                    {model.creator?.fullName || model.creator?.username || "Autor"}
                  </Link>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    background: Number(model.price || 0) > 0 ? "rgba(252, 165, 165, 0.2)" : "rgba(187, 247, 208, 0.2)",
                    color: Number(model.price || 0) > 0 ? "#b91c1c" : "#15803d",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "var(--radius-full)",
                    border: Number(model.price || 0) > 0 ? "1px solid rgba(248, 113, 113, 0.3)" : "1px solid rgba(134, 239, 172, 0.3)"
                  }}>
                    {Number(model.price || 0) > 0 ? "Pago" : "Open"}
                  </span>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--muted)", fontSize: "0.8rem" }}>
                  <span>v{model.version}</span>
                  <Link href={`/models/${model.slug}`} style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "none", fontSize: "0.85rem" }}>Gerar Agora →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}