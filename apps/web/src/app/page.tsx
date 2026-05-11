import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getTranslation } from "@/locales";

const prisma = new PrismaClient();

export default async function Home() {
  const session = await auth();
  const t = getTranslation("pt");
  const models = await prisma.model.findMany({
    where: { isActive: true, isPublic: true },
    include: { category: true },
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
              border-color: #3b82f6 !important;
            }
          `}} />
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--foreground)" }}>{t.home.popular.title}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {models.map(model => (
              <Link key={model.id} href={`/models/${model.slug}`} style={{ textDecoration: "none" }}>
                <div 
                  className="premium-card"
                  style={{ 
                    backgroundColor: "var(--card-bg)", 
                    padding: "2rem", 
                    borderRadius: "24px", 
                    border: "1px solid var(--card-border)",
                    boxShadow: "0 10px 15px -3px var(--shadow)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ 
                    color: "#2563eb", 
                    fontSize: "0.7rem", 
                    fontWeight: "800", 
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: "rgba(37, 99, 235, 0.1)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    display: "inline-block",
                    width: "fit-content"
                  }}>
                    {model.category?.name || "Documento"}
                  </div>
                  <h4 style={{ color: "var(--foreground)", margin: "0 0 0.75rem 0", fontSize: "1.25rem", fontWeight: "700" }}>{model.name}</h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0, lineHeight: "1.5", flex: 1 }}>{model.description}</p>
                  <div style={{ marginTop: "1.5rem", color: "#3b82f6", fontWeight: "bold", fontSize: "0.875rem" }}>Ver Detalhes →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
      </main>
    </div>
  );
}