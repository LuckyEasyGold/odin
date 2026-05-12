import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslation } from "@/locales";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const t = getTranslation("pt"); // Future: Get from user profile or cookie

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "calc(100vh - 73px)", 
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      transition: "all 0.3s ease"
    }}>
      {/* Sidebar */}
      <aside style={{ 
        width: "260px", 
        backgroundColor: "var(--sidebar)", 
        color: "white", 
        padding: "1.5rem",
        borderRight: "1px solid var(--card-border)"
      }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: "bold", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Menu Painel</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Link href="/dashboard" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "white", backgroundColor: "rgba(255,255,255,0.1)" }}>
            📊 {t.common.nav.dashboard}
          </Link>
          <Link href="/dashboard/wallet" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            💰 Minha Carteira
          </Link>
          <Link href="/dashboard/keys" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            🔑 {t.common.nav.apiKey}
          </Link>
          <Link href="/dashboard/webhooks" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            📡 {t.common.nav.webhooks}
          </Link>
          <Link href="/models" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#94a3b8" }}>
            📂 {t.common.nav.explore}
          </Link>
          <Link href="/dashboard/models/new" style={{ padding: "0.75rem", borderRadius: "8px", textDecoration: "none", color: "#10b981", fontWeight: "bold" }}>
            ✨ {t.common.nav.createModel}
          </Link>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.875rem", color: "#94a3b8" }}>
            Usuário: <br/> <strong>{session.user?.name || session.user?.email}</strong>
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
      <main style={{ flex: 1, padding: "2rem", backgroundColor: "var(--background)" }}>
        {children}
      </main>
    </div>
  );
}
