"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardMobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  return (
    <nav className="bottom-tabs show-mobile" style={{
      display: "flex",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 999,
      height: "calc(64px + env(safe-area-inset-bottom, 0px))",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
      background: "var(--card-bg)",
      borderTop: "1px solid var(--card-border)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      boxShadow: "0 -4px 20px var(--shadow)",
    }}>
      <Tab href="/dashboard" icon="📊" label="Painel" isActive={isActive("/dashboard") && !isActive("/dashboard/wallet") && !isActive("/dashboard/keys") && !isActive("/dashboard/webhooks") && !isActive("/dashboard/models")} />
      <Tab href="/dashboard/wallet" icon="💰" label="Carteira" isActive={isActive("/dashboard/wallet")} />
      <Tab href="/dashboard/keys" icon="🔑" label="Chaves" isActive={isActive("/dashboard/keys")} />
      <Tab href="/dashboard/webhooks" icon="📡" label="Webhooks" isActive={isActive("/dashboard/webhooks")} />
      <Tab href="/dashboard/models/new" icon="✨" label="Criar" isActive={isActive("/dashboard/models/new")} />
    </nav>
  );
}

function Tab({ href, icon, label, isActive: active }: { href: string; icon: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1px",
        padding: "0.35rem 0.25rem",
        color: active ? "var(--primary)" : "var(--muted)",
        textDecoration: "none",
        fontSize: "0.6rem",
        fontWeight: active ? "700" : "600",
        transition: "color 0.2s ease",
        WebkitTapHighlightColor: "transparent",
        position: "relative",
      }}
    >
      {active && (
        <div style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "24px",
          height: "3px",
          background: "var(--primary)",
          borderRadius: "0 0 3px 3px",
        }} />
      )}
      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{icon}</span>
      <span style={{ lineHeight: 1 }}>{label}</span>
    </Link>
  );
}
