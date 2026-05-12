import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyBalance, getMyTransactions } from "@/app/actions/wallet";

export default async function WalletPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const balance = await getMyBalance();
  const transactions = await getMyTransactions();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", color: "var(--foreground)" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>💰 Minha Carteira</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
          Gerencie seu saldo, visualize ganhos de autoria e acompanhe seu extrato.
        </p>
      </header>

      {/* Balance Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
        <div style={{ 
          padding: "2.5rem", 
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
          borderRadius: "24px", 
          color: "white",
          boxShadow: "0 20px 25px -5px rgba(37, 99, 235, 0.2)"
        }}>
          <div style={{ fontSize: "0.9rem", opacity: 0.8, marginBottom: "0.5rem", fontWeight: "bold", textTransform: "uppercase" }}>Saldo Disponível</div>
          <div style={{ fontSize: "3rem", fontWeight: "800" }}>R$ {balance.toFixed(2)}</div>
          <button style={{ 
            marginTop: "2rem", 
            width: "100%", 
            padding: "1rem", 
            backgroundColor: "white", 
            color: "#2563eb", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold", 
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}>
            + Adicionar Saldo (Simulação)
          </button>
        </div>

        <div style={{ 
          padding: "2.5rem", 
          backgroundColor: "var(--card-bg)", 
          borderRadius: "24px", 
          border: "1px solid var(--card-border)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: "0.5rem", fontWeight: "bold", textTransform: "uppercase" }}>Total de Ganhos (Autor)</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#10b981" }}>
            R$ {transactions.filter(t => t.type === "EARNING").reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)}
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "1rem" }}>
            Você recebe 80% do valor de cada geração dos seus modelos premium.
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ backgroundColor: "var(--card-bg)", borderRadius: "24px", border: "1px solid var(--card-border)", overflow: "hidden" }}>
        <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--card-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Extrato de Transações</h3>
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Exibindo últimas 50 movimentações</span>
        </div>

        {transactions.length === 0 ? (
          <div style={{ padding: "5rem", textAlign: "center", color: "var(--muted)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>📑</span>
            Nenhuma transação encontrada.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.05)", color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>
                <th style={{ padding: "1.25rem 2rem" }}>Data</th>
                <th style={{ padding: "1.25rem 2rem" }}>Descrição</th>
                <th style={{ padding: "1.25rem 2rem" }}>Tipo</th>
                <th style={{ padding: "1.25rem 2rem", textAlign: "right" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "1.25rem 2rem", fontSize: "0.9rem", color: "var(--muted)" }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1.25rem 2rem", fontWeight: "500" }}>{t.description}</td>
                  <td style={{ padding: "1.25rem 2rem" }}>
                    <span style={{ 
                      fontSize: "0.75rem", 
                      padding: "0.25rem 0.6rem", 
                      borderRadius: "6px", 
                      fontWeight: "bold",
                      backgroundColor: t.type === "PURCHASE" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                      color: t.type === "PURCHASE" ? "#ef4444" : "#10b981"
                    }}>
                      {t.type}
                    </span>
                  </td>
                  <td style={{ 
                    padding: "1.25rem 2rem", 
                    textAlign: "right", 
                    fontWeight: "bold",
                    color: Number(t.amount) < 0 ? "#ef4444" : "#10b981"
                  }}>
                    {Number(t.amount) < 0 ? "-" : "+"} R$ {Math.abs(Number(t.amount)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
