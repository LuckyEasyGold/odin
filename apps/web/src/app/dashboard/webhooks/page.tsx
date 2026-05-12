import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyWebhooks } from "@/app/actions/webhooks";
import WebhookManager from "./WebhookManager";

export default async function WebhooksPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const webhooks = await getMyWebhooks();

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", color: "var(--foreground)" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>📡 Webhooks</h1>
        <p style={{ color: "var(--muted)", fontSize: "1.1rem" }}>
          Receba notificações em tempo real no seu servidor quando eventos ocorrerem no ODIN.
        </p>
      </header>

      <div style={{ 
        padding: "2rem", 
        backgroundColor: "rgba(16, 185, 129, 0.05)", 
        borderRadius: "24px", 
        border: "1px solid rgba(16, 185, 129, 0.2)",
        marginBottom: "3rem",
        display: "flex",
        gap: "1.5rem",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "2rem" }}>🛡️</span>
        <div>
          <h3 style={{ margin: "0 0 0.5rem 0", color: "#065f46" }}>Assinatura de Segurança</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#065f46", lineHeight: "1.6" }}>
            Todas as requisições incluem o cabeçalho <code>x-odin-signature</code>. Use o seu <strong>secret</strong> para validar que a requisição é legítima.
          </p>
        </div>
      </div>

      <WebhookManager initialWebhooks={JSON.parse(JSON.stringify(webhooks))} />
    </div>
  );
}
