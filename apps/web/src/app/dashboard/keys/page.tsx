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
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>🔑 Chaves de API</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
          Gerencie suas credenciais para acessar o ODIN via CLI, SDK ou integrações externas.
        </p>
      </header>

      <div style={{ 
        padding: "2rem", 
        backgroundColor: "rgba(59, 130, 246, 0.05)", 
        borderRadius: "24px", 
        border: "1px solid rgba(59, 130, 246, 0.2)",
        marginBottom: "3rem"
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--primary)" }}>Dica de Segurança</h3>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)", lineHeight: "1.6" }}>
          Suas chaves de API têm as mesmas permissões que sua conta. Nunca compartilhe suas chaves ou as publique em repositórios públicos. 
          As chaves são exibidas <strong>apenas uma vez</strong> após a criação.
        </p>
      </div>

      <KeysList initialKeys={JSON.parse(JSON.stringify(keys))} />
    </div>
  );
}
