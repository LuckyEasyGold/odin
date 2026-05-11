"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Load theme from localStorage
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

  return (
    <nav style={{
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
      color: "var(--foreground)"
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
            color: "var(--muted)", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            Modelos
          </Link>
          <Link href="/docs" style={{ 
            color: "var(--muted)", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "0.9rem"
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
  );
}
