"use client";

import { useState } from "react";
import { generateApiKey, revokeApiKey } from "@/app/actions/keys";

export default function KeysList({ initialKeys }: { initialKeys: any[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateApiKey(newKeyName || "Minha Chave");
      if (result.success) {
        setRevealedKey(result.key || null);
        setNewKeyName("");
        setIsCreating(false);
        // Refresh local list (ideally would re-fetch but for MVP we just show the modal)
      }
    } catch (error) {
      alert("Erro ao gerar chave");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Tem certeza que deseja revogar esta chave? Aplicações usando ela pararão de funcionar imediatamente.")) return;
    
    try {
      await revokeApiKey(id);
      setKeys(keys.filter(k => k.id !== id));
    } catch (error) {
      alert("Erro ao revogar");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Chaves Ativas ({keys.length})</h2>
        <button 
          onClick={() => {
            setIsCreating(true);
            setRevealedKey(null);
          }}
          style={{ 
            padding: "0.75rem 1.5rem", 
            backgroundColor: "var(--primary)", 
            color: "white", 
            border: "none", 
            borderRadius: "12px", 
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 10px var(--shadow)"
          }}
        >
          + Gerar Nova Chave
        </button>
      </div>

      {/* Modal / Create Form */}
      {isCreating && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <form onSubmit={handleCreate} style={{ 
            backgroundColor: "var(--card-bg)", padding: "2.5rem", borderRadius: "24px", maxWidth: "500px", width: "90%",
            border: "1px solid var(--card-border)", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
          }}>
            <h2 style={{ marginTop: 0 }}>Nova Chave de API</h2>
            <p style={{ color: "var(--muted)" }}>Dê um nome para identificar onde você usará esta chave.</p>
            <input 
              autoFocus
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Ex: Servidor de Automação"
              style={{ 
                width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--card-border)", 
                backgroundColor: "var(--background)", color: "var(--foreground)", marginBottom: "1.5rem", fontSize: "1rem"
              }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={() => setIsCreating(false)} style={{ flex: 1, padding: "1rem", background: "none", border: "1px solid var(--card-border)", borderRadius: "12px", color: "var(--foreground)", cursor: "pointer" }}>Cancelar</button>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: "1rem", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Gerando..." : "Gerar Chave"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Modal (Reveal Key) */}
      {revealedKey && (
        <div style={{ 
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100,
          backdropFilter: "blur(8px)"
        }}>
          <div style={{ 
            backgroundColor: "var(--card-bg)", padding: "2.5rem", borderRadius: "24px", maxWidth: "600px", width: "90%",
            border: "2px solid #10b981", boxShadow: "0 0 30px rgba(16, 185, 129, 0.3)", textAlign: "center"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h2 style={{ marginTop: 0, color: "#10b981" }}>Chave Gerada com Sucesso!</h2>
            <p style={{ color: "var(--muted)" }}>Copie sua chave agora. Você não poderá vê-la novamente.</p>
            
            <div style={{ 
              backgroundColor: "#111", color: "#10b981", padding: "1.5rem", borderRadius: "12px", 
              fontFamily: "monospace", fontSize: "1.2rem", wordBreak: "break-all", marginBottom: "2rem",
              border: "1px solid #333", display: "flex", alignItems: "center", gap: "1rem"
            }}>
              <span style={{ flex: 1 }}>{revealedKey}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(revealedKey);
                  alert("Copiado!");
                }}
                style={{ backgroundColor: "#333", border: "none", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer" }}
              >
                Copiar
              </button>
            </div>

            <button 
              onClick={() => {
                setRevealedKey(null);
                window.location.reload(); // Refresh to see the new key in list
              }}
              style={{ width: "100%", padding: "1rem", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: "12px", fontWeight: "bold", cursor: "pointer" }}
            >
              Entendido, já salvei a chave
            </button>
          </div>
        </div>
      )}

      {/* Keys Table */}
      <div style={{ backgroundColor: "var(--card-bg)", borderRadius: "24px", border: "1px solid var(--card-border)", overflow: "hidden" }}>
        {keys.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--muted)" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}>🗝️</span>
            Você ainda não possui chaves de API ativas.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", backgroundColor: "rgba(0,0,0,0.05)", color: "var(--muted)", fontSize: "0.85rem", textTransform: "uppercase" }}>
                <th style={{ padding: "1.25rem 2rem" }}>Nome / Identificador</th>
                <th style={{ padding: "1.25rem 2rem" }}>Prefixo</th>
                <th style={{ padding: "1.25rem 2rem" }}>Criada em</th>
                <th style={{ padding: "1.25rem 2rem" }}>Último Uso</th>
                <th style={{ padding: "1.25rem 2rem" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} style={{ borderTop: "1px solid var(--card-border)" }}>
                  <td style={{ padding: "1.25rem 2rem", fontWeight: "bold" }}>{k.name}</td>
                  <td style={{ padding: "1.25rem 2rem" }}>
                    <code style={{ backgroundColor: "var(--background)", padding: "0.3rem 0.6rem", borderRadius: "6px" }}>odin_...</code>
                  </td>
                  <td style={{ padding: "1.25rem 2rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1.25rem 2rem", color: "var(--muted)", fontSize: "0.9rem" }}>
                    {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Nunca"}
                  </td>
                  <td style={{ padding: "1.25rem 2rem" }}>
                    <button 
                      onClick={() => handleRevoke(k.id)}
                      style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "bold", cursor: "pointer" }}
                    >
                      Revogar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
