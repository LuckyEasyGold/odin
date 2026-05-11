import Link from "next/link";
import { getTranslation } from "@/locales";

export default function Home() {
  const t = getTranslation("pt"); // Ativo em Português no momento

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
        <h1 style={{ color: "#2563eb" }}>{t.common.title}</h1>
        <p style={{ color: "#666" }}>{t.common.description}</p>
      </header>

      <section style={{ marginBottom: "2rem" }}>
        <h2>{t.home.hero.title}</h2>
        <p style={{ color: "#555" }}>{t.home.hero.description}</p>
      </section>

      <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link
          href="/models"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          {t.home.actions.browse}
        </Link>
        <a
          href="/api/v1/mcp/tools"
          style={{ padding: "0.5rem 1rem", border: "1px solid #2563eb", borderRadius: "4px", textDecoration: "none" }}
        >
          {t.home.actions.apiDoc}
        </a>
      </nav>

      <section>
        <h3>{t.home.popular.title}</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #f3f3f3" }}>
            <Link href="/models/budget" style={{ textDecoration: "none", color: "#2563eb" }}>
              {t.home.popular.budget}
            </Link>
          </li>
          <li style={{ padding: "0.5rem 0", borderBottom: "1px solid #f3f3f3" }}>
            <Link href="/models/contract" style={{ textDecoration: "none", color: "#2563eb" }}>
              {t.home.popular.contract}
            </Link>
          </li>
          <li style={{ padding: "0.5rem 0" }}>
            <Link href="/models/proposal" style={{ textDecoration: "none", color: "#2563eb" }}>
              {t.home.popular.proposal}
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}