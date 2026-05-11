import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Fetch data in parallel for speed
  const [totalGenerations, rawModels, recentGenerations] = await Promise.all([
    prisma.generation.count({ where: { userId: session.user.id } }),
    prisma.model.findMany({
      where: { createdBy: session.user.id },
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

  // Serialize models for safety
  const myModels = rawModels.map(m => ({
    ...m,
    price: Number(m.price),
    rating: Number(m.rating),
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }));

  const balance = 0;

  return (
    <div style={{ padding: "1rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#0f172a" }}>Dashboard</h1>
        <p style={{ color: "#64748b" }}>Gestão completa dos seus documentos e modelos.</p>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Gerados</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b" }}>{totalGenerations}</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Modelos</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b" }}>{myModels.length}</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase" }}>Saldo</div>
          <div style={{ fontSize: "1.75rem", fontWeight: "800", color: "#10b981" }}>R$ {balance.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>
        {/* My Models */}
        <section style={{ backgroundColor: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Minhas Contribuições</h2>
            <Link href="/dashboard/models/new" style={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: "bold", textDecoration: "none" }}>+ Novo Modelo</Link>
          </div>
          {myModels.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>Nenhum modelo criado ainda.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {myModels.map(m => (
                <div key={m.id} style={{ padding: "1rem", borderRadius: "16px", backgroundColor: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>{m.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{m.category?.name || "Geral"} • {m.isPublic ? "Público" : "Privado"}</div>
                  </div>
                  <Link href={`/dashboard/models/${m.id}/edit`} style={{ fontSize: "0.8rem", color: "#3b82f6", textDecoration: "none" }}>Editar</Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section style={{ backgroundColor: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "2rem" }}>Atividade Recente</h2>
          {recentGenerations.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>Nenhum documento gerado.</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {recentGenerations.map(g => (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: "500" }}>{g.model.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{new Date(g.createdAt).toLocaleDateString()}</div>
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
