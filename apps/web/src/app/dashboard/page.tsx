// @ts-ignore
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { deleteModel } from "@/app/actions/models";
import DeleteModelButton from "@/components/DeleteModelButton";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [totalGenerations, rawModels, rawRecentGenerations] = await Promise.all([
    prisma.generation.count({ where: { userId: session.user.id } }),
    prisma.model.findMany({
      where: { createdBy: session.user.id, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.generation.findMany({
      where: { userId: session.user.id },
      include: { model: true },
      take: 5,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const myModels = JSON.parse(JSON.stringify(rawModels));
  const recentGenerations = JSON.parse(JSON.stringify(rawRecentGenerations));

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--foreground)" }}>Dashboard</h1>
        <p style={{ color: "var(--muted)" }}>Gestão completa dos seus documentos e modelos.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "20px", boxShadow: "0 1px 3px var(--shadow)", border: "1px solid var(--card-border)" }}>
          <div style={{ color: "var(--muted)", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Gerados</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--foreground)" }}>{totalGenerations}</div>
        </div>
        <div style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "20px", boxShadow: "0 1px 3px var(--shadow)", border: "1px solid var(--card-border)" }}>
          <div style={{ color: "var(--muted)", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Modelos</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--foreground)" }}>{myModels.length}</div>
        </div>
        
        {/* Specialist Card */}
        <div style={{ 
          backgroundColor: (session.user as any).isSpecialist ? "rgba(16, 185, 129, 0.1)" : "var(--card-bg)", 
          padding: "1.5rem", 
          borderRadius: "20px", 
          boxShadow: "0 1px 3px var(--shadow)", 
          border: `1px solid ${(session.user as any).isSpecialist ? "#10b981" : "var(--card-border)"}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ color: session.user.isSpecialist ? "#10b981" : "var(--muted)", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>
            {session.user.isSpecialist ? "🎖️ Perfil Especialista Ativo" : "Curadoria"}
          </div>
          <div style={{ fontSize: "0.9rem", color: "var(--foreground)", marginTop: "0.5rem" }}>
            {session.user.isSpecialist 
              ? `${session.user.specialty} Verificado` 
              : "Torne-se um curador para emitir pareceres técnicos."
            }
          </div>
          {!session.user.isSpecialist && (
            <Link
              href="/dashboard/curation"
              style={{
                marginTop: "1rem",
                display: "inline-block",
                padding: "0.8rem 1.1rem",
                backgroundColor: "#0ea5e9",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "700"
              }}
            >
              Saiba como participar
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        {/* My Models */}
        <section style={{ backgroundColor: "var(--card-bg)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--card-border)", boxShadow: "0 4px 6px var(--shadow)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--foreground)" }}>Minhas Contribuições</h2>
            <Link href="/dashboard/models/new" style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>+ Novo Modelo</Link>
          </div>
          {myModels.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem" }}>Nenhum modelo criado ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {myModels.map((m: any) => (
                <div key={m.id} style={{ padding: "1rem", borderRadius: "16px", backgroundColor: "var(--background)", border: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem", color: "var(--foreground)" }}>{m.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{m.category?.name || "Geral"} • {m.isPublic ? "Público" : "Privado"}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <Link href={`/dashboard/models/${m.id}/edit`} style={{ fontSize: "0.8rem", color: "var(--primary)", textDecoration: "none" }}>Editar</Link>
                    <DeleteModelButton id={m.id} action={deleteModel} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section style={{ backgroundColor: "var(--card-bg)", padding: "2rem", borderRadius: "24px", border: "1px solid var(--card-border)", boxShadow: "0 4px 6px var(--shadow)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "2rem", color: "var(--foreground)" }}>Atividade Recente</h2>
          {recentGenerations.length === 0 ? (
            <p style={{ color: "var(--muted)", textAlign: "center", padding: "2rem" }}>Nenhum documento gerado.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {recentGenerations.map((g: any) => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: "500", color: "var(--foreground)" }}>{g.model.name}</div>
                      {g.signatureStatus && (
                        <span style={{ 
                          fontSize: "0.6rem", 
                          padding: "2px 6px", 
                          borderRadius: "4px", 
                          backgroundColor: g.signatureStatus === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: g.signatureStatus === 'COMPLETED' ? '#10b981' : '#f59e0b',
                          border: `1px solid ${g.signatureStatus === 'COMPLETED' ? '#10b981' : '#f59e0b'}`,
                          textTransform: "uppercase",
                          fontWeight: "bold"
                        }}>
                          {g.signatureStatus}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{new Date(g.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
