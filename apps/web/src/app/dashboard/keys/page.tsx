import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyKeys } from "@/app/actions/keys";
import KeysList from "./KeysList";

export default async function KeysPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const keys = await getMyKeys();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", color: "var(--foreground)" }}>
      <header style={{ marginBottom: "clamp(1.5rem, 3vw, 3rem)" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", marginBottom: "0.25rem" }}>🔑 Chaves de API</h1>
        <p style={{ color: "var(--muted)", fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}>
          Gerencie suas credenciais para acessar o ODIN via CLI, SDK ou integrações.
        </p>
      </header>

      <div style={{ 
        padding: "clamp(1rem, 2vw, 2rem)", 
        backgroundColor: "rgba(59, 130, 246, 0.05)", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid rgba(59, 130, 246, 0.2)",
        marginBottom: "clamp(1.5rem, 3vw, 3rem)"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)", fontSize: "0.95rem" }}>Dica de Segurança</h3>
        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.6" }}>
          Suas chaves têm as mesmas permissões que sua conta. Nunca compartilhe. 
          As chaves são exibidas <strong>apenas uma vez</strong> após a criação.
        </p>
      </div>

      <KeysList initialKeys={JSON.parse(JSON.stringify(keys))} />
    </div>
  );
}
