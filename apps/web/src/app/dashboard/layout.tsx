import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslation } from "@/locales";
import DashboardMobileNav from "./DashboardMobileNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const t = getTranslation("pt");

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ 
      display: "flex", 
      minHeight: "100vh",
      backgroundColor: "var(--background)",
      color: "var(--foreground)",
      transition: "all 0.3s ease"
    }}>
      {/* ═══ DESKTOP SIDEBAR (≥768px) ═══ */}
      <aside className="show-desktop" style={{ 
        width: "260px", 
        backgroundColor: "var(--sidebar)", 
        color: "white", 
        padding: "1.5rem",
        borderRight: "1px solid var(--card-border)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        flexShrink: 0,
      }}>
        <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link href="/" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🔱</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "900" }}>ODIN</span>
          </Link>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", flex: 1 }}>
          <NavItem href="/dashboard" icon="📊" label={t.common.nav.dashboard} />
          <NavItem href="/dashboard/wallet" icon="💰" label="Minha Carteira" />
          <NavItem href="/dashboard/keys" icon="🔑" label={t.common.nav.apiKey} />
          <NavItem href="/dashboard/webhooks" icon="📡" label={t.common.nav.webhooks} />
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "0.75rem 0", paddingTop: "0.75rem" }} />
          <NavItem href="/models" icon="📂" label={t.common.nav.explore} />
          <NavItem href="/dashboard/models/new" icon="✨" label={t.common.nav.createModel} highlight />
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ marginBottom: "1rem", fontSize: "0.8rem", color: "#94a3b8" }}>
            <div style={{ fontWeight: "600", color: "white", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              {session.user?.name || session.user?.email}
            </div>
            {session.user?.email && (
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{session.user.email}</div>
            )}
          </div>
          <form action={async () => { 
            "use server"; 
            await signOut({ redirectTo: "/" }); 
          }}>
            <button style={{ 
              width: "100%", 
              padding: "0.6rem", 
              backgroundColor: "rgba(239, 68, 68, 0.15)", 
              color: "#ef4444", 
              border: "1px solid rgba(239, 68, 68, 0.3)", 
              borderRadius: "10px", 
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              transition: "all 0.2s"
            }}>
              Sair da Conta
            </button>
          </form>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ 
        flex: 1, 
        padding: "clamp(1rem, 2vw, 2.5rem)",
        backgroundColor: "var(--background)",
        maxWidth: "100%",
        overflowX: "hidden",
      }}>
        {children}
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <DashboardMobileNav />
    </div>
  );
}

function NavItem({ href, icon, label, highlight = false }: { href: string; icon: string; label: string; highlight?: boolean }) {
  return (
    <Link 
      href={href} 
      style={{ 
        padding: "0.7rem 0.9rem", 
        borderRadius: "10px", 
        textDecoration: "none", 
        color: highlight ? "#10b981" : "#94a3b8",
        fontWeight: highlight ? "700" : "500",
        fontSize: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        transition: "all 0.15s",
        backgroundColor: highlight ? "rgba(16, 185, 129, 0.1)" : "transparent",
      }}
    >
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      {label}
    </Link>
  );
}
