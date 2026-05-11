"use client";

import { useState, useEffect } from "react";
import { getTranslation } from "@/locales";

interface Rating {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function RatingSection({ modelId }: { modelId: string }) {
  const t = getTranslation("pt");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, [modelId]);

  const fetchRatings = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/models/${modelId}/ratings`);
      if (res.ok) {
        const data = await res.json();
        setRatings(data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/v1/models/${modelId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // For MVP, we simulate a userId. In Phase 3 we will have real Auth.
        body: JSON.stringify({ userId: "anonymous-user", rating: userRating, comment }),
      });

      if (res.ok) {
        setComment("");
        fetchRatings();
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "3rem", borderTop: "1px solid #e2e8f0", paddingTop: "2rem" }}>
      <h2>Avaliações e Feedback</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginTop: "1.5rem" }}>
        {/* Form */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h4 style={{ marginBottom: "1rem" }}>Deixe sua avaliação</h4>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Nota (1-5)</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  style={{
                    fontSize: "1.5rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: star <= userRating ? "#f59e0b" : "#d1d5db"
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Comentário (opcional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", border: "1px solid #e2e8f0" }}
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#1e293b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>

        {/* List */}
        <div>
          <h4 style={{ marginBottom: "1rem" }}>Comentários recentes ({ratings.length})</h4>
          {ratings.length === 0 ? (
            <p style={{ color: "#64748b" }}>Ainda não há avaliações para este modelo.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {ratings.map((r) => (
                <div key={r.id} style={{ padding: "1rem", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ color: "#f59e0b" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{r.comment || "Sem comentário."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
