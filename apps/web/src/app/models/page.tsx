import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { getTranslation } from "@/locales";

const prisma = new PrismaClient();

export default async function ModelsPage() {
  const t = getTranslation("pt");
  
  const models = await prisma.model.findMany({
    where: { isPublic: true },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main style={{ 
      padding: "3rem 2rem", 
      maxWidth: "1300px", 
      margin: "0 auto",
      minHeight: "100vh",
      background: "radial-gradient(circle at top right, #f8fafc 0%, #ffffff 100%)"
    }}>
      <header style={{ marginBottom: "4rem", textAlign: "center" }}>
        <Link href="/" style={{ 
          color: "#3b82f6", 
          textDecoration: "none", 
          fontSize: "0.9rem", 
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem"
        }}>
          ← {t.models.back}
        </Link>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: "800", 
          color: "#0f172a", 
          letterSpacing: "-0.02em",
          marginBottom: "1rem"
        }}>
          {t.models.title}
        </h1>
        <p style={{ 
          fontSize: "1.25rem", 
          color: "#64748b", 
          maxWidth: "700px", 
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          {t.models.description}
        </p>
      </header>

      {models.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", backgroundColor: "#f8fafc", borderRadius: "24px" }}>
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>{t.models.empty}</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", 
          gap: "2.5rem" 
        }}>
          {models.map((model: any) => (
            <Link
              key={model.id}
              href={`/models/${model.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "2rem",
                borderRadius: "24px",
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "white",
                border: "1px solid #f1f5f9",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden"
              }}
              className="model-card"
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .model-card:hover {
                  transform: translateY(-8px);
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
                  border-color: #3b82f6;
                }
              `}} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <span style={{ 
                  fontSize: "0.75rem", 
                  background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", 
                  color: "#2563eb", 
                  padding: "0.4rem 1rem", 
                  borderRadius: "100px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {model.category?.name || "Sem Categoria"}
                </span>
                
                <div style={{ 
                  backgroundColor: "#f0fdf4", 
                  color: "#166534", 
                  padding: "0.4rem 0.8rem", 
                  borderRadius: "12px", 
                  fontSize: "0.75rem",
                  fontWeight: "800"
                }}>
                  GRÁTIS
                </div>
              </div>

              <h3 style={{ 
                margin: "0 0 1rem 0", 
                color: "#1e293b", 
                fontSize: "1.5rem",
                fontWeight: "700",
                lineHeight: "1.2"
              }}>
                {model.name}
              </h3>
              
              <p style={{ 
                margin: 0, 
                fontSize: "1rem", 
                color: "#64748b", 
                lineHeight: "1.6",
                flex: 1
              }}>
                {model.description}
              </p>

              <div style={{ 
                marginTop: "2rem", 
                paddingTop: "1.5rem", 
                borderTop: "1px solid #f1f5f9",
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div style={{ fontSize: "0.875rem", color: "#94a3b8", fontWeight: "500" }}>
                  Versão {model.version}
                </div>
                <div style={{ 
                  color: "#3b82f6", 
                  fontWeight: "700", 
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}>
                  Gerar Agora →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}