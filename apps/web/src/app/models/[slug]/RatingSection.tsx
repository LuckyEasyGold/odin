"use client";

import { useState, useEffect } from "react";
import { getTranslation } from "@/locales";
import { useSession } from "next-auth/react";
import { submitTechnicalReview } from "@/app/actions/curation";

interface Rating {
  id: string;
  rating: number;
  comment: string;
  isTechnical: boolean;
  isApproval: boolean;
  createdAt: string;
  user: {
    fullName: string;
    username: string;
    isSpecialist: boolean;
    specialty: string;
  };
}

export default function RatingSection({ modelId }: { modelId: string }) {
  const t = getTranslation("pt");
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isApproval, setIsApproval] = useState(true);
  const [loading, setLoading] = useState(false);

  // @ts-ignore
  const isSpecialist = session?.user?.isSpecialist;

  useEffect(() => {
    fetchRatings();
  }, [modelId]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    try {
      const res = await fetch(`${apiUrl}/api/v1/models/${modelId}/ratings`);
      if (res.ok) {
        const data = await res.json();
        setRatings(data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSpecialist) {
        await submitTechnicalReview(modelId, userRating, comment, isApproval);
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        await fetch(`${apiUrl}/api/v1/models/${modelId}/ratings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: session?.user?.id || "anonymous", 
            rating: userRating, 
            comment 
          }),
        });
      }
      
      setComment("");
      fetchRatings();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "4rem", borderTop: "1px solid var(--card-border)", paddingTop: "3rem" }}>
      <h2 style={{ color: "var(--foreground)", marginBottom: "2rem" }}>Pareceres e Avaliações</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "3rem" }}>
        {/* Form */}
        <form onSubmit={handleReview} style={{ 
          backgroundColor: "var(--card-bg)", 
          padding: "2rem", 
          borderRadius: "24px", 
          boxShadow: "0 4px 6px var(--shadow)",
          border: `1px solid ${isSpecialist ? "var(--primary)" : "var(--card-border)"}`,
          height: "fit-content"
        }}>
          <h4 style={{ marginBottom: "1rem", color: "var(--foreground)" }}>
            {isSpecialist ? "⚖️ Emitir Parecer Técnico" : "Deixe sua avaliação"}
          </h4>
          
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.85rem" }}>Sua Nota</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  style={{
                    fontSize: "1.75rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: star <= userRating ? "#f59e0b" : "var(--card-border)"
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {isSpecialist && (
            <div style={{ 
              marginBottom: "1.5rem", 
              padding: "1rem", 
              backgroundColor: "rgba(59, 130, 246, 0.05)", 
              borderRadius: "12px",
              border: "1px solid rgba(59, 130, 246, 0.2)"
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={isApproval} 
                  onChange={(e) => setIsApproval(e.target.checked)} 
                  style={{ width: "18px", height: "18px" }}
                />
                <span style={{ fontSize: "0.9rem", fontWeight: "bold", color: "var(--foreground)" }}>Aprovar este modelo juridicamente</span>
              </label>
            </div>
          )}

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--muted)", fontSize: "0.85rem" }}>
              {isSpecialist ? "Considerações Técnicas" : "Comentário"}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isSpecialist ? "Análise técnica sobre as cláusulas e validade..." : "O que achou do modelo?"}
              style={{ 
                width: "100%", 
                padding: "0.75rem", 
                borderRadius: "12px", 
                border: "1px solid var(--card-border)",
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                fontSize: "1rem"
              }}
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !session}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: isSpecialist ? "var(--primary)" : "var(--foreground)",
              color: "var(--background)",
              border: "none",
              borderRadius: "12px",
              fontWeight: "bold",
              cursor: loading || !session ? "not-allowed" : "pointer",
              opacity: session ? 1 : 0.5
            }}
          >
            {!session ? "Entre para avaliar" : loading ? "Enviando..." : isSpecialist ? "Publicar Parecer" : "Enviar Avaliação"}
          </button>
        </form>

        {/* List */}
        <div>
          <h4 style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>Atividade Recente ({ratings.length})</h4>
          {ratings.length === 0 ? (
            <p style={{ color: "var(--muted)" }}>Ainda não há avaliações para este modelo.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {ratings.map((r) => (
                <div key={r.id} style={{ 
                  padding: "1.5rem", 
                  backgroundColor: r.isTechnical ? "rgba(16, 185, 129, 0.05)" : "var(--card-bg)", 
                  borderRadius: "20px",
                  border: `1px solid ${r.isTechnical ? "#10b981" : "var(--card-border)"}`,
                  boxShadow: "0 2px 4px var(--shadow)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontWeight: "bold", color: "var(--foreground)" }}>
                        {r.user?.fullName || r.user?.username || "Usuário"}
                      </span>
                      {r.isTechnical && (
                        <span style={{ 
                          fontSize: "0.7rem", 
                          backgroundColor: "#10b981", 
                          color: "white", 
                          padding: "0.2rem 0.5rem", 
                          borderRadius: "4px",
                          fontWeight: "bold"
                        }}>
                          ✓ {r.user?.specialty || "Especialista"}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div style={{ color: "#f59e0b", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                    {r.isApproval && <span style={{ marginLeft: "1rem", color: "#10b981", fontWeight: "bold" }}>🛡️ Modelo Aprovado</span>}
                  </div>
                  
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "var(--foreground)", lineHeight: "1.6", fontStyle: r.isTechnical ? "italic" : "normal" }}>
                    {r.comment || "Sem comentário."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
