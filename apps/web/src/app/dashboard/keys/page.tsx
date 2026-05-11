import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const keys = await prisma.apiKey.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Chaves de API</h1>
        <p style={{ color: "#64748b" }}>Use estas chaves para autenticar suas requisições via código.</p>
      </header>

      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Suas Chaves</h2>
          <button style={{ 
            padding: "0.6rem 1.2rem", 
            backgroundColor: "#1e293b", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            + Gerar Nova Chave
          </button>
        </div>

        {keys.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", border: "2px dashed #e2e8f0", borderRadius: "12px" }}>
            <p style={{ color: "#64748b" }}>Você ainda não tem chaves de API ativas.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "1rem", color: "#64748b" }}>Nome</th>
                <th style={{ padding: "1rem", color: "#64748b" }}>Chave</th>
                <th style={{ padding: "1rem", color: "#64748b" }}>Criada em</th>
                <th style={{ padding: "1rem", color: "#64748b" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr key={key.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "1rem", fontWeight: "bold" }}>{key.name}</td>
                  <td style={{ padding: "1rem" }}>
                    <code>odin_live_••••••••{key.id.slice(-4)}</code>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.5rem", 
                      backgroundColor: "#ecfdf5", 
                      color: "#059669", 
                      borderRadius: "9999px",
                      fontSize: "0.75rem",
                      fontWeight: "bold"
                    }}>
                      Ativa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#fefce8", borderRadius: "12px", border: "1px solid #fef08a" }}>
        <h4 style={{ color: "#854d0e", marginBottom: "0.5rem" }}>💡 Dica de Segurança</h4>
        <p style={{ fontSize: "0.875rem", color: "#a16207", margin: 0 }}>
          Nunca compartilhe suas chaves de API em locais públicos ou no front-end do seu site. 
          Sempre as utilize em ambientes de servidor seguros.
        </p>
      </div>
    </div>
  );
}
