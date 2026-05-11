import Link from "next/link";

export default function DocsPage() {
  return (
    <main style={{ 
      padding: "4rem 2rem", 
      maxWidth: "1000px", 
      margin: "0 auto",
      lineHeight: "1.6",
      color: "#334155"
    }}>
      <header style={{ marginBottom: "4rem" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", color: "#0f172a", marginBottom: "1rem" }}>
          Documentação da API ODIN
        </h1>
        <p style={{ fontSize: "1.25rem", color: "#64748b" }}>
          Integre a geração de documentos profissionais diretamente no seu software ou fluxo de trabalho de IA.
        </p>
      </header>

      {/* Introdução */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
          1. Introdução
        </h2>
        <p>
          A API do ODIN permite que você utilize nossa vasta biblioteca de modelos profissionais para gerar documentos dinâmicos. 
          Nossa infraestrutura suporta tanto chamadas REST tradicionais quanto o protocolo <strong>MCP (Model Context Protocol)</strong>, 
          permitindo que agentes de IA "entendam" e criem documentos complexos em seu nome.
        </p>
      </section>

      {/* Autenticação */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
          2. Autenticação
        </h2>
        <p>
          Todas as requisições devem incluir sua chave de API no cabeçalho <code>x-api-key</code>. 
          Você pode gerar suas chaves no seu <Link href="/dashboard/keys" style={{ color: "#3b82f6", fontWeight: "600" }}>Dashboard</Link>.
        </p>
        <div style={{ backgroundColor: "#1e293b", color: "#e2e8f0", padding: "1rem", borderRadius: "12px", fontFamily: "monospace", fontSize: "0.9rem" }}>
          x-api-key: odin_live_xxxxxxxxxxxxxxxx
        </div>
      </section>

      {/* Endpoint de Geração */}
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ color: "#0f172a", borderBottom: "2px solid #f1f5f9", paddingBottom: "0.5rem", marginBottom: "1.5rem" }}>
          3. Gerar Documento (POST)
        </h2>
        <p>Use este endpoint para fundir dados dinâmicos com um modelo existente.</p>
        <div style={{ marginBottom: "1rem" }}>
          <span style={{ backgroundColor: "#10b981", color: "white", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: "bold", fontSize: "0.8rem", marginRight: "0.5rem" }}>POST</span>
          <code>/api/v1/generate</code>
        </div>
        
        <h4 style={{ marginBottom: "0.5rem" }}>Corpo da Requisição (JSON):</h4>
        <pre style={{ backgroundColor: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", overflowX: "auto" }}>
{`{
  "modelId": "id-do-modelo",
  "inputs": {
    "cliente": "João Silva",
    "valor": "1.500,00"
  },
  "format": "pdf"
}`}
        </pre>
      </section>

      {/* Integração MCP */}
      <section style={{ marginBottom: "4rem", backgroundColor: "#eff6ff", padding: "2rem", borderRadius: "24px", border: "1px solid #dbeafe" }}>
        <h2 style={{ color: "#1e40af", marginBottom: "1rem" }}>⚡ Integração com IA (MCP)</h2>
        <p>
          O ODIN é compatível com o <strong>Model Context Protocol</strong> da Anthropic. 
          Isso significa que você pode conectar o ODIN diretamente ao Claude Desktop ou qualquer IDE compatível.
        </p>
        <p>URL do Servidor MCP:</p>
        <code>http://localhost:3001/api/v1/mcp</code>
      </section>

      {/* Footer Docs */}
      <footer style={{ marginTop: "6rem", textAlign: "center", color: "#94a3b8", fontSize: "0.875rem" }}>
        <p>© 2026 ODIN Infrastructure. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
