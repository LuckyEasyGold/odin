import Link from "next/link";

export default function DocsPage() {
  return (
    <main style={{ 
      padding: "4rem 2rem", 
      maxWidth: "1100px", 
      margin: "0 auto",
      lineHeight: "1.7",
      color: "var(--foreground)",
      backgroundColor: "var(--background)",
      minHeight: "100vh"
    }}>
      {/* Hero Section */}
      <header style={{ marginBottom: "5rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "900", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
          Central de Conhecimento ODIN 🔱
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--muted)", maxWidth: "800px", margin: "0 auto" }}>
          Tudo o que você precisa saber para criar, gerenciar e integrar documentos profissionais com inteligência e conformidade.
        </p>
      </header>

      {/* Grid de Navegação Rápida */}
      <nav style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem", 
        marginBottom: "6rem" 
      }}>
        {["Fundamentos", "Biblioteca", "Editor", "Compliance", "Finanças", "Assinaturas", "Desenvolvedores", "Segurança"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
            padding: "1rem",
            textAlign: "center",
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: "12px",
            color: "var(--foreground)",
            textDecoration: "none",
            fontWeight: "700",
            transition: "all 0.2s ease"
          }}>
            {item}
          </a>
        ))}
      </nav>

      {/* 1. Fundamentos */}
      <section id="fundamentos" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          🔱 1. Fundamentos do ODIN
        </h2>
        <p>
          O ODIN (Open Document Infrastructure Network) é uma infraestrutura aberta projetada para padronizar a criação de documentos. 
          Ao contrário de editores de texto comuns, o ODIN trata documentos como <strong>dados estruturados</strong>.
        </p>
        <div style={{ backgroundColor: "rgba(37, 99, 235, 0.05)", padding: "1.5rem", borderRadius: "16px", borderLeft: "4px solid #2563eb", marginTop: "1rem" }}>
          <strong>Conceito Chave:</strong> Um documento no ODIN nasce de um <strong>Modelo</strong> (molde) preenchido com <strong>Inputs</strong> (dados), resultando em um artefato final imutável.
        </div>
      </section>

      {/* 2. Biblioteca */}
      <section id="biblioteca" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          🏛️ 2. Biblioteca & Busca
        </h2>
        <p>
          Nossa biblioteca é categorizada para facilitar o acesso. Você encontrará modelos de:
        </p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li><strong>Jurídico:</strong> Contratos, Termos de Uso, Procurações.</li>
          <li><strong>Comercial:</strong> Orçamentos, Propostas, Recibos.</li>
          <li><strong>Imobiliário:</strong> Contratos de Locação, Compra e Venda.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          Modelos com o selo 🛡️ foram verificados por nossa equipe de curadoria técnica.
        </p>
      </section>

      {/* 3. Editor */}
      <section id="editor" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          ✍️ 3. Criação de Modelos (Editor)
        </h2>
        <p>
          Qualquer usuário pode criar modelos usando a sintaxe <strong>Handlebars</strong>.
        </p>
        <div style={{ backgroundColor: "#1e293b", color: "#e2e8f0", padding: "1.5rem", borderRadius: "12px", fontFamily: "monospace", margin: "1rem 0" }}>
          {`Olá {{nome_cliente}}, segue sua proposta de R$ {{valor_total}}.`}
        </div>
        <p>
          Ao criar um modelo, você pode definir <strong>Dicas de Orientação</strong> para cada variável, ajudando quem for preencher o documento a não cometer erros.
        </p>
      </section>

      {/* 4. Compliance */}
      <section id="compliance" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          🛡️ 4. Curadoria & Compliance
        </h2>
        <p>
          O ODIN possui um <strong>Legal Linter</strong> integrado. Ao salvar um modelo, o sistema analisa automaticamente:
        </p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li>Cláusula de Foro e Rescisão.</li>
          <li>Identificação clara das partes.</li>
          <li>Definição de preço e prazos.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>
          Modelos de alta qualidade recebem um <strong>Score de Compliance</strong>. Especialistas podem revisar modelos da comunidade e conferir o selo de verificação oficial.
        </p>
      </section>

      {/* 5. Finanças */}
      <section id="finanças" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          💰 5. Carteira & Marketplace
        </h2>
        <p>
          O ODIN permite a monetização de modelos de alta qualidade:
        </p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li><strong>Saldo:</strong> Adicione créditos para gerar modelos premium.</li>
          <li><strong>Ganhos de Autoria:</strong> Se você criar um modelo verificado e colocá-lo como pago, você recebe <strong>80% do valor</strong> de cada geração feita por outros usuários.</li>
          <li><strong>Histórico:</strong> Acompanhe todas as transações na sua <Link href="/dashboard/wallet" style={{ color: "#3b82f6" }}>Carteira</Link>.</li>
        </ul>
      </section>

      {/* 5.1 Assinaturas */}
      <section id="assinaturas" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          ✍️ 6. Assinaturas Eletrônicas
        </h2>
        <p>
          O ODIN integra-se com o <strong>Documenso</strong> para oferecer um fluxo completo de assinatura digital.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
          <div style={{ padding: "1.5rem", backgroundColor: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Fluxo Integrado</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Adicione signatários diretamente no momento da geração do documento.</p>
          </div>
          <div style={{ padding: "1.5rem", backgroundColor: "var(--card-bg)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Status em Tempo Real</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Acompanhe quem já assinou e quem ainda falta através do dashboard.</p>
          </div>
        </div>
        <p style={{ marginTop: "1.5rem" }}>
          Ao preencher um documento, você pode adicionar o <strong>Nome</strong> e <strong>E-mail</strong> das partes interessadas. O ODIN cuidará do envio dos e-mails de convite e da coleta das assinaturas juridicamente válidas.
        </p>
      </section>

      {/* 7. Desenvolvedores */}
      <section id="desenvolvedores" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          🔑 7. Developer Hub (Integração)
        </h2>
        <p>Para desenvolvedores, oferecemos três formas de integração:</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
          <div style={{ padding: "1.5rem", border: "1px solid var(--card-border)", borderRadius: "16px" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>REST API</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Endpoints padrão JSON para gerar documentos via HTTP.</p>
            <code style={{ fontSize: "0.8rem", display: "block", marginTop: "1rem" }}>POST /api/v1/generate</code>
          </div>
          <div style={{ padding: "1.5rem", border: "1px solid var(--card-border)", borderRadius: "16px" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>ODIN CLI</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Ferramenta de linha de comando para automação em servidores.</p>
            <code style={{ fontSize: "0.8rem", display: "block", marginTop: "1rem" }}>npx odin generate</code>
          </div>
          <div style={{ padding: "1.5rem", border: "1px solid var(--card-border)", borderRadius: "16px" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>MCP Protocol</h4>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Conecte o ODIN ao Claude Desktop ou Cursor para gerar documentos via IA.</p>
          </div>
        </div>
      </section>

      {/* 8. Segurança */}
      <section id="segurança" style={{ marginBottom: "6rem" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          📑 8. Segurança & Integridade
        </h2>
        <p>
          Cada documento gerado pelo ODIN é único e rastreável:
        </p>
        <ul style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
          <li><strong>Document DNA:</strong> Um hash SHA-256 é gerado no momento da criação.</li>
          <li><strong>Audit Trail:</strong> Registramos o endereço IP e o carimbo de tempo da geração.</li>
          <li><strong>Assinatura Eletrônica:</strong> Integração oficial com Documenso para assinaturas com validade jurídica.</li>
        </ul>
      </section>

      <footer style={{ 
        marginTop: "10rem", 
        paddingTop: "4rem", 
        borderTop: "1px solid var(--card-border)", 
        textAlign: "center", 
        color: "var(--muted)", 
        fontSize: "0.875rem" 
      }}>
        <p>🔱 ODIN - Onde o documento encontra a inteligência e a lei.</p>
        <p style={{ marginTop: "0.5rem" }}>© 2026 ODIN Infrastructure Network.</p>
      </footer>
    </main>
  );
}
