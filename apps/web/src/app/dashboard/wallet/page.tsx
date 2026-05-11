import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10,
      }
    }
  });

  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.875rem", fontWeight: "bold" }}>Minha Carteira</h1>
        <p style={{ color: "#64748b" }}>Gerencie seus créditos e visualize suas transações.</p>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* Balance Card */}
        <div style={{ 
          backgroundColor: "#1e293b", 
          color: "white", 
          padding: "2rem", 
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Saldo Disponível</div>
          <div style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
            R$ {Number(user.balance).toFixed(2)}
          </div>
          <button style={{ 
            width: "100%", 
            padding: "0.75rem", 
            backgroundColor: "#2563eb", 
            color: "white", 
            border: "none", 
            borderRadius: "8px", 
            fontWeight: "bold",
            cursor: "pointer"
          }}>
            + Adicionar Créditos
          </button>
        </div>

        {/* Transactions List */}
        <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Últimas Transações</h2>
          
          {user.transactions.length === 0 ? (
            <p style={{ color: "#64748b", textAlign: "center", marginTop: "2rem" }}>Nenhuma transação encontrada.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {user.transactions.map((tx) => (
                <div key={tx.id} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px"
                }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{tx.description || tx.type}</div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div style={{ 
                    fontWeight: "bold", 
                    color: tx.type === "CREDIT" || tx.type === "EARNING" ? "#10b981" : "#ef4444" 
                  }}>
                    {tx.type === "DEBIT" ? "-" : "+"} R$ {Number(tx.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
