"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Ocorreu um erro ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "1rem",
      backgroundColor: "var(--background)" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        backgroundColor: "var(--card-bg)", 
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 10px 25px var(--shadow)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔱</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--foreground)" }}>Entrar no ODIN</h1>
          <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>Acesse sua conta para gerenciar documentos</p>
        </div>

        {error && (
          <div style={{ 
            padding: "0.75rem", 
            backgroundColor: "#fee2e2", 
            color: "#b91c1c", 
            borderRadius: "10px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
            fontWeight: "500"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--foreground)" }}>
              Username ou Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ex: system"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "var(--foreground)" }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
          Ainda não tem conta?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: "700" }}>
            Criar conta
          </Link>
        </div>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--muted)", fontSize: "0.8rem", textDecoration: "none" }}>
            ← Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
