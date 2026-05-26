import { notFound } from "next/navigation";

interface VerifyData {
  valid: boolean;
  documentId: string;
  modelName: string;
  modelVersion: string;
  hash: string;
  createdAt: string;
  signers: Array<{
    name: string;
    email: string;
    status: string;
    signedAt?: string;
  }>;
}

async function getVerification(id: string): Promise<VerifyData | null> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://odin-api-eight.vercel.app";
    const res = await fetch(`${apiUrl}/api/v1/verify/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getVerification(id);

  if (!data) {
    return (
      <main style={{
        minHeight: "100vh",
        backgroundColor: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          padding: "3rem 2rem",
          backgroundColor: "var(--card-bg)",
          border: "1px solid #fca5a5",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>❌</div>
          <h1 style={{ color: "#b91c1c", fontSize: "1.5rem", marginBottom: "0.75rem" }}>
            Documento não encontrado
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: "1.6" }}>
            Este documento não existe na base de dados do ODIN ou o QR code está danificado.
          </p>
        </div>
      </main>
    );
  }

  const allSigned =
    data.signers.length === 0 ||
    data.signers.every((s) => s.status === "SIGNED");

  return (
    <main style={{
      minHeight: "100vh",
      backgroundColor: "var(--background)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        maxWidth: "560px",
        width: "100%",
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}>

        {/* Header verde */}
        <div style={{
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
          padding: "2.5rem 2rem",
          textAlign: "center",
          color: "white",
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "0.75rem" }}>✅</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "800", margin: "0 0 0.5rem" }}>
            Documento Válido
          </h1>
          <p style={{ opacity: 0.9, fontSize: "1rem", margin: 0 }}>
            Este documento foi gerado e autenticado pela plataforma ODIN
          </p>
        </div>

        {/* Corpo */}
        <div style={{ padding: "2rem" }}>

          {/* Nome do modelo */}
          <div style={{
            backgroundColor: "rgba(59, 130, 246, 0.06)",
            border: "1px solid rgba(59, 130, 246, 0.15)",
            borderRadius: "12px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.25rem",
          }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Modelo do documento
            </p>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700", color: "var(--foreground)" }}>
              {data.modelName}
              <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", fontWeight: "400", color: "var(--muted)" }}>
                v{data.modelVersion}
              </span>
            </p>
          </div>

          {/* Data de geração */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}>
            <div style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Gerado em
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "600", color: "var(--foreground)" }}>
                {formatDate(data.createdAt)}
              </p>
            </div>

            <div style={{
              backgroundColor: "var(--background)",
              border: "1px solid var(--card-border)",
              borderRadius: "12px",
              padding: "1rem 1.25rem",
            }}>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Assinaturas
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: "600", color: allSigned ? "#16a34a" : "#d97706" }}>
                {data.signers.length === 0
                  ? "Sem assinaturas"
                  : allSigned
                  ? `${data.signers.length} assinado${data.signers.length > 1 ? "s" : ""}`
                  : `${data.signers.filter((s) => s.status === "SIGNED").length}/${data.signers.length} assinado${data.signers.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Signatários */}
          {data.signers.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ margin: "0 0 0.75rem", fontSize: "0.75rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Signatários
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.signers.map((signer, i) => (
                  <div key={i} style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--card-border)",
                    borderRadius: "10px",
                  }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "0.9rem", color: "var(--foreground)" }}>
                        {signer.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--muted)" }}>
                        {signer.email}
                      </p>
                    </div>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "20px",
                      backgroundColor: signer.status === "SIGNED" ? "rgba(22, 163, 74, 0.1)" : "rgba(217, 119, 6, 0.1)",
                      color: signer.status === "SIGNED" ? "#16a34a" : "#d97706",
                    }}>
                      {signer.status === "SIGNED" ? "✓ Assinado" : "⏳ Pendente"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hash */}
          <div style={{
            backgroundColor: "var(--background)",
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{ margin: "0 0 0.4rem", fontSize: "0.7rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Hash de autenticidade (SHA-256)
            </p>
            <p style={{
              margin: 0,
              fontSize: "0.72rem",
              fontFamily: "monospace",
              color: "var(--muted)",
              wordBreak: "break-all",
              lineHeight: "1.5",
            }}>
              {data.hash}
            </p>
          </div>

          {/* Rodapé */}
          <div style={{
            textAlign: "center",
            paddingTop: "1rem",
            borderTop: "1px solid var(--card-border)",
          }}>
            <p style={{ margin: "0 0 0.25rem", fontSize: "0.8rem", color: "var(--muted)" }}>
              Verificado por
            </p>
            <p style={{ margin: 0, fontWeight: "700", fontSize: "1rem", color: "var(--primary)" }}>
              🔐 ODIN — Open Document Infrastructure Network
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
