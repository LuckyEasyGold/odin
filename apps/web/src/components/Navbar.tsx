"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: scrolled ? "0.75rem 5%" : "1.25rem 5%",
      backgroundColor: scrolled ? "rgba(255, 255, 255, 0.8)" : "white",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #f1f5f9" : "1px solid transparent",
      transition: "all 0.3s ease",
      boxShadow: scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.05)" : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
        <Link href="/" style={{ 
          fontSize: "1.5rem", 
          fontWeight: "900", 
          color: "#0f172a", 
          textDecoration: "none",
          letterSpacing: "-0.02em"
        }}>
          ODIN<span style={{ color: "#3b82f6" }}>.</span>
        </Link>

        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/models" style={{ 
            color: "#64748b", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "0.95rem"
          }}>
            Explorar Modelos
          </Link>
          <Link href="/docs" style={{ 
            color: "#64748b", 
            textDecoration: "none", 
            fontWeight: "600",
            fontSize: "0.95rem"
          }}>
            Documentação
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {session ? (
          <>
            <Link href="/dashboard" style={{ 
              color: "#1e293b", 
              textDecoration: "none", 
              fontWeight: "700",
              fontSize: "0.9rem",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              backgroundColor: "#f1f5f9"
            }}>
              Meu Dashboard
            </Link>
            <button 
              onClick={() => signOut()}
              style={{ 
                color: "#ef4444", 
                background: "none", 
                border: "none", 
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ 
              color: "#64748b", 
              textDecoration: "none", 
              fontWeight: "600",
              fontSize: "0.95rem"
            }}>
              Entrar
            </Link>
            <Link href="/register" style={{ 
              backgroundColor: "#1e293b", 
              color: "white", 
              padding: "0.6rem 1.5rem", 
              borderRadius: "12px", 
              textDecoration: "none", 
              fontWeight: "700",
              fontSize: "0.9rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}>
              Criar Conta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
