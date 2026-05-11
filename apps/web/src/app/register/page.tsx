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
      backgroundColor: "#f8fafc" 
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "450px", 
        padding: "2rem", 
        backgroundColor: "white", 
        borderRadius: "16px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            ← Voltar para o Início
          </Link>
        </div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#0f172a" }}>Criar Conta no ODIN</h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Junte-se à maior rede de infraestrutura de documentos</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "1.5rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Username</label>
            <input name="username" value={formData.username} onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Nome Completo</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>Senha</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "0.75rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "8px", fontWeight: "600" }}
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem", color: "#64748b" }}>
          Já tem conta? <Link href="/login" style={{ color: "#2563eb", fontWeight: "600" }}>Entrar</Link>
        </div>
      </div>
    </div>
  );
}
