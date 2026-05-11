import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f1f5f9" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", backgroundColor: "#1e293b", color: "white", padding: "1.5rem" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>ODIN</h2>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/dashboard" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "white", backgroundColor: "#334155" }}>
            📊 Visão Geral
          </Link>
          <Link href="/dashboard/wallet" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            💰 Minha Carteira
          </Link>
          <Link href="/dashboard/keys" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            🔑 Chaves de API
          </Link>
          <Link href="/models" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            📂 Explorar Modelos
          </Link>
          <Link href="/dashboard/settings" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            ⚙️ Configurações
          </Link>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#94a3b8" }}>
            Logado como: <br/> <strong>{session.user?.name || session.user?.email}</strong>
          </div>
          <form action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/" }); 
          }}>
            <button style={{ width: "100%", padding: "0.5rem", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
              Sair
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "2rem" }}>
        {children}
      </main>
    </div>
  );
}
