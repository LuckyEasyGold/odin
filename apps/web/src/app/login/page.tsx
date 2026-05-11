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
      backgroundColor: "#f8fafc" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        padding: "2rem", 
        backgroundColor: "white", 
        borderRadius: "16px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>Entrar no ODIN</h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Acesse sua conta para gerenciar documentos</p>
        </div>

        {error && (
          <div style={{ 
            padding: "0.75rem", 
            backgroundColor: "#fee2e2", 
            color: "#b91c1c", 
            borderRadius: "8px",
            marginBottom: "1.5rem",
            fontSize: "0.875rem"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
              Username ou Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                borderRadius: "8px", 
                border: "1px solid #e2e8f0",
                outline: "none"
              }}
              placeholder="ex: system"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500" }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                borderRadius: "8px", 
                border: "1px solid #e2e8f0",
                outline: "none"
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          Ainda não tem conta?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: "600" }}>
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
