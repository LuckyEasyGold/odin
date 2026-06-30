"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For MVP, we will use a server action or API route to create the user.
      // Since we don't have the API route for register yet, let's assume we'll create it.
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado");
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
        maxWidth: "450px", 
        padding: "clamp(1.5rem, 4vw, 2.5rem)",
        backgroundColor: "var(--card-bg)", 
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 10px 25px var(--shadow)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔱</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", color: "var(--foreground)" }}>Criar Conta no ODIN</h1>
          <p style={{ color: "var(--muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>Junte-se à maior rede de infraestrutura de documentos</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "10px", marginBottom: "1.5rem", fontWeight: "500" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--foreground)" }}>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--foreground)" }}>Nome Completo</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--foreground)" }}>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", color: "var(--foreground)" }}>Senha</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
          Já tem conta? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "700" }}>Entrar</Link>
        </div>

        <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
          <Link href="/" style={{ color: "var(--muted)", fontSize: "0.8rem", textDecoration: "none" }}>
            ← Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}
