import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { GenerationRepository } from "@odin/storage";
import Link from "next/link";

const prisma = new PrismaClient();
const genRepo = new GenerationRepository(prisma);

export default async function DashboardPage() {
  const session = await auth();
  
  // We already checked session in layout.tsx, but TypeScript needs this.
  if (!session?.user?.id) return null;

  const generations = await genRepo.findByUserId(session.user.id);

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Bem-vindo, {session.user.name}!</h1>
        <p style={{ color: "#64748b" }}>Aqui estão seus documentos recentes e estatísticas.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Documentos Gerados</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{generations.length}</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Modelos Favoritos</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3</div>
        </div>
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Uso de API</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Ativo</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <section style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Atividade Recente</h2>
        
        {generations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
            <p>Você ainda não gerou nenhum documento.</p>
            <Link href="/models" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>Explorar modelos agora →</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: "500" }}>Modelo</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: "500" }}>Data</th>
                <th style={{ padding: "1rem", color: "#64748b", fontWeight: "500" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {generations.map((gen: any) => (
                <tr key={gen.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: "500" }}>{gen.model?.name || "Modelo Removido"}</td>
                  <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>{new Date(gen.createdAt).toLocaleString("pt-BR")}</td>
                  <td style={{ padding: "1rem" }}>
                    <a 
                      href={`http://localhost:3001/api/v1/generations/${gen.id}/download`} 
                      target="_blank"
                      style={{ color: "#2563eb", textDecoration: "none", fontSize: "0.875rem", fontWeight: "bold" }}
                    >
                      Baixar PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
