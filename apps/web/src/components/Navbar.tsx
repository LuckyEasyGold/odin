"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* ─── Tab icon SVGs ─── */
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ModelsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const DocsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const LoginIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    const savedTheme = localStorage.getItem("odin-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("odin-theme", newTheme);
  };

  // Don't show navbar on dashboard pages (dashboard has its own sidebar/tabs)
  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) {
    return null; // Dashboard has its own layout
  }

  const isActive = (path: string) => pathname === path;
  const isModels = pathname?.startsWith("/models");
  const isDocs = pathname?.startsWith("/docs");

  return (
    <>
      {/* ═══════ DESKTOP TOP NAV ═══════ */}
      <nav className="desktop-nav" style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: scrolled ? "0.75rem 5%" : "1.25rem 5%",
        backgroundColor: theme === "dark" ? "rgba(13, 17, 23, 0.8)" : "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${theme === "dark" ? "#30363d" : "#f1f5f9"}`,
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
        color: "var(--foreground)",
        height: "var(--top-nav-height)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <Image src="/logo.png" alt="ODIN" width={32} height={32} style={{ borderRadius: "6px" }} />
            <span style={{ 
              fontSize: "1.25rem", 
              fontWeight: "900", 
              color: "var(--foreground)", 
              letterSpacing: "-0.02em"
            }}>
              ODIN
            </span>
          </Link>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/models" style={{ 
              color: isModels ? "var(--primary)" : "var(--muted)", 
              textDecoration: "none", 
              fontWeight: isModels ? "700" : "600",
              fontSize: "0.9rem",
              transition: "color 0.2s"
            }}>
              Modelos
            </Link>
            <Link href="/docs" style={{ 
              color: isDocs ? "var(--primary)" : "var(--muted)", 
              textDecoration: "none", 
              fontWeight: isDocs ? "700" : "600",
              fontSize: "0.9rem",
              transition: "color 0.2s"
            }}>
              Docs
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              background: theme === "dark" ? "#30363d" : "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            title={theme === "light" ? "Modo Escuro" : "Modo Claro"}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/dashboard" style={{ 
                color: "var(--foreground)", 
                textDecoration: "none", 
                fontWeight: "700",
                fontSize: "0.85rem",
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                backgroundColor: theme === "dark" ? "#161b22" : "#f1f5f9",
                border: `1px solid ${theme === "dark" ? "#30363d" : "transparent"}`
              }}>
                Meu Painel
              </Link>
              <button 
                onClick={() => signOut()}
                style={{ 
                  color: "#ef4444", 
                  background: "none", 
                  border: "none", 
                  fontWeight: "600",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                Sair
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link href="/login" style={{ 
                color: "var(--muted)", 
                textDecoration: "none", 
                fontWeight: "600",
                fontSize: "0.9rem"
              }}>
                Entrar
              </Link>
              <Link href="/register" style={{ 
                backgroundColor: "var(--foreground)", 
                color: "var(--background)", 
                padding: "0.6rem 1.25rem", 
                borderRadius: "10px", 
                textDecoration: "none", 
                fontWeight: "700",
                fontSize: "0.85rem"
              }}>
                Criar Conta
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ═══════ MOBILE BOTTOM TABS ═══════ */}
      <nav className="bottom-tabs">
        <Link href="/" className={`bottom-tab ${isActive("/") ? "bottom-tab--active" : ""}`}>
          <HomeIcon />
          <span>Início</span>
        </Link>
        <Link href="/models" className={`bottom-tab ${isModels ? "bottom-tab--active" : ""}`}>
          <ModelsIcon />
          <span>Modelos</span>
        </Link>
        <Link href="/docs" className={`bottom-tab ${isDocs ? "bottom-tab--active" : ""}`}>
          <DocsIcon />
          <span>Docs</span>
        </Link>
        {session ? (
          <Link href="/dashboard" className={`bottom-tab ${isDashboard ? "bottom-tab--active" : ""}`}>
            <DashboardIcon />
            <span>Painel</span>
          </Link>
        ) : (
          <Link href="/login" className={`bottom-tab ${isActive("/login") ? "bottom-tab--active" : ""}`}>
            <LoginIcon />
            <span>Entrar</span>
          </Link>
        )}
      </nav>

      
    </>
  );
}
