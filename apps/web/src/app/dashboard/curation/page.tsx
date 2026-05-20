import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function CurationPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/dashboard" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: "700" }}>← Voltar ao Dashboard</Link>
      </div>

      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--foreground)", marginBottom: "0.75rem" }}>Curadoria Técnica</h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: "1.75" }}>
          Especialistas verificados podem emitir pareceres técnicos sobre modelos, aprovar conteúdos e conceder o selo de verificação ODIN.
          Isso ajuda a comunidade a identificar modelos auditados por profissionais da área.
        </p>
      </header>

      <section style={{ marginBottom: "2rem", backgroundColor: "var(--card-bg)", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--card-border)", boxShadow: "0 4px 8px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "1rem" }}>O que faz um curador?</h2>
        <p style={{ color: "var(--foreground)", lineHeight: "1.8" }}>
          Um curador técnico é um especialista que analisa modelos da comunidade e emite um parecer sobre sua conformidade e qualidade.
          Quando um modelo é aprovado, ele recebe o selo 🛡️ e fica mais fácil para outros usuários confiarem e usarem aquele conteúdo.
        </p>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "1rem" }}>Como participar</h3>
        <ol style={{ color: "var(--foreground)", lineHeight: "1.8", paddingLeft: "1.25rem" }}>
          <li>Crie ou faça login na sua conta ODIN.</li>
          <li>Seu perfil deve ser reconhecido como especialista pela equipe ODIN.</li>
          <li>Depois de verificado, você poderá acessar modelos e emitir pareceres técnicos diretamente na plataforma.</li>
          <li>Modelos aprovados recebem o selo de verificação e maior visibilidade.</li>
        </ol>
      </section>

      <section style={{ marginBottom: "2rem", backgroundColor: "rgba(59, 130, 246, 0.05)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "1rem" }}>Requisitos</h3>
        <ul style={{ color: "var(--foreground)", lineHeight: "1.8", paddingLeft: "1.25rem" }}>
          <li>Experiência na área jurídica ou de conformidade.</li>
          <li>Perfil profissional completo e confiável.</li>
          <li>Compromisso em revisar modelos com cuidado técnico.</li>
        </ul>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "1rem" }}>O que você poderá fazer</h3>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ backgroundColor: "var(--card-bg)", padding: "1.25rem", borderRadius: "18px", border: "1px solid var(--card-border)" }}>
            <strong>Emitir parecer técnico</strong>
            <p style={{ margin: "0.5rem 0 0", color: "var(--muted)", lineHeight: "1.7" }}>
              Registrar sua análise sobre a validade e conformidade do modelo.
            </p>
          </div>
          <div style={{ backgroundColor: "var(--card-bg)", padding: "1.25rem", borderRadius: "18px", border: "1px solid var(--card-border)" }}>
            <strong>Aprovar modelos</strong>
            <p style={{ margin: "0.5rem 0 0", color: "var(--muted)", lineHeight: "1.7" }}>
              Validar conteúdos e ajudar outros usuários a escolher modelos seguros.
            </p>
          </div>
          <div style={{ backgroundColor: "var(--card-bg)", padding: "1.25rem", borderRadius: "18px", border: "1px solid var(--card-border)" }}>
            <strong>Dar mais credibilidade</strong>
            <p style={{ margin: "0.5rem 0 0", color: "var(--muted)", lineHeight: "1.7" }}>
              Seu parecer aumenta a confiança da comunidade e melhora a qualidade do catálogo ODIN.
            </p>
          </div>
        </div>
      </section>

      {!session.user.isSpecialist ? (
        <section style={{ backgroundColor: "var(--card-bg)", padding: "1.5rem", borderRadius: "20px", border: "1px solid var(--card-border)", boxShadow: "0 4px 8px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "700", marginBottom: "1rem", color: "var(--foreground)" }}>Ainda não é especialista?</h3>
          <p style={{ color: "var(--foreground)", lineHeight: "1.8", marginBottom: "1rem" }}>
            No momento, a curadoria técnica é ativa para especialistas verificados pela equipe ODIN.
            Caso queira participar, mantenha seu perfil atualizado e aguarde a abertura formal do programa.
          </p>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Em breve, vamos disponibilizar um processo automático de candidatura para curadores e especialistas.
          </p>
        </section>
      ) : (
        <section style={{ backgroundColor: "rgba(16, 185, 129, 0.08)", padding: "1.5rem", borderRadius: "20px", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--foreground)", marginBottom: "1rem" }}>Você já é um especialista</h3>
          <p style={{ color: "var(--foreground)", lineHeight: "1.8" }}>
            Parabéns! Agora você pode revisar modelos da comunidade e emitir pareceres técnicos com selo de verificação.
          </p>
        </section>
      )}
    </div>
  );
}
