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
      <header style={{ marginBottom: "clamp(1.5rem, 3vw, 3rem)" }}>
        <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: "800", marginBottom: "0.25rem" }}>📡 Webhooks</h1>
        <p style={{ color: "var(--muted)", fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)" }}>
          Receba notificações em tempo real no seu servidor quando eventos ocorrerem.
        </p>
      </header>

      <div style={{ 
        padding: "clamp(1rem, 2vw, 2rem)", 
        backgroundColor: "rgba(16, 185, 129, 0.05)", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid rgba(16, 185, 129, 0.2)",
        marginBottom: "clamp(1.5rem, 3vw, 3rem)",
        display: "flex",
        gap: "1rem",
        alignItems: "center"
      }}>
        <span style={{ fontSize: "1.5rem" }}>🛡️</span>
        <div>
          <h3 style={{ margin: "0 0 0.25rem 0", color: "#065f46", fontSize: "0.95rem" }}>Assinatura de Segurança</h3>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#065f46", lineHeight: "1.6" }}>
            Todas as requisições incluem <code>x-odin-signature</code>. Use o <strong>secret</strong> para validar.
          </p>
        </div>
      </div>

      <WebhookManager initialWebhooks={JSON.parse(JSON.stringify(webhooks))} />
    </div>
  );
}
