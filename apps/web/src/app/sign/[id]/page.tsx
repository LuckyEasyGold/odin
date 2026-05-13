"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function SignaturePage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [generation, setGeneration] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreed: false
  });

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/v1/verify/${id}`);
      if (!res.ok) throw new Error("Documento não encontrado");
      const data = await res.json();
      setGeneration(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;

    setSigning(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const res = await fetch(`${apiUrl}/api/v1/generations/${id}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          signatureData: `NATIVE_SIGN_${Date.now()}`
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Falha ao assinar");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSigning(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white', padding: '2rem', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '0.8rem 2rem', background: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Tentar Novamente</button>
      </div>
    </div>
  );

  if (success) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white', textAlign: 'center' }}>
      <div style={{ padding: '3rem', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✅</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Documento Assinado!</h1>
        <p style={{ opacity: 0.7, marginBottom: '2rem' }}>Sua assinatura foi registrada com sucesso na rede ODIN.</p>
        <button onClick={() => window.close()} style={{ padding: '0.8rem 2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Fechar Janela</button>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "radial-gradient(circle at top right, #1e293b, #0f172a)", 
      color: "white",
      fontFamily: "'Inter', sans-serif",
      padding: "2rem"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', margin: 0 }}>ODIN<span style={{ color: '#3b82f6' }}>SIGN</span></h1>
            <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>Autoridade de Integridade Documental</p>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '99px', border: '1px solid rgba(59, 130, 246, 0.2)', fontSize: '0.8rem', color: '#60a5fa' }}>
            ● Verificação de Identidade Ativa
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Left: Preview */}
          <div style={{ 
            background: 'rgba(255,255,255,0.02)', 
            borderRadius: '24px', 
            border: '1px solid rgba(255,255,255,0.05)', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Visualização do Documento</h2>
              <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>ID: {id.split('-')[0]}...</span>
            </div>
            
            <div style={{ 
              flex: 1, 
              background: 'white', 
              borderRadius: '12px', 
              minHeight: '600px',
              overflow: 'hidden',
              position: 'relative'
            }}>
               <iframe 
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/generations/${id}/download`}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>

          {/* Right: Action Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.05)', 
              backdropFilter: 'blur(20px)',
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Assinar Documento</h2>
              <p style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '2rem' }}>
                Este documento é protegido pela infraestrutura ODIN. Sua assinatura terá validade jurídica e será vinculada ao seu e-mail e endereço IP.
              </p>

              <form onSubmit={handleSign} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Como aparece no seu documento"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.7 }}>E-mail de Verificação</label>
                  <input 
                    required
                    type="email" 
                    placeholder="o-mesmo-do-convite@exemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem', color: 'white', outline: 'none' }}
                  />
                </div>

                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  borderRadius: '12px', 
                  background: 'rgba(59, 130, 246, 0.05)', 
                  border: '1px solid rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }} onClick={() => setFormData({...formData, agreed: !formData.agreed})}>
                  <input 
                    type="checkbox" 
                    checked={formData.agreed}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.8, lineHeight: 1.4 }}>
                    Eu li e concordo com os termos do documento acima e aceito que minha assinatura eletrônica seja processada pelo ODIN.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={!formData.agreed || signing}
                  style={{ 
                    marginTop: '1rem',
                    padding: '1.2rem', 
                    borderRadius: '16px', 
                    background: formData.agreed ? '#3b82f6' : 'rgba(255,255,255,0.05)',
                    color: 'white', 
                    border: 'none', 
                    fontWeight: 700, 
                    cursor: formData.agreed && !signing ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease',
                    boxShadow: formData.agreed ? '0 10px 15px -3px rgba(59, 130, 246, 0.4)' : 'none'
                  }}
                >
                  {signing ? "Processando Assinatura..." : "Confirmar Assinatura Digital"}
                </button>
              </form>
            </div>

            {/* Info Card */}
            <div style={{ 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.05)', 
              padding: '1.5rem',
              fontSize: '0.8rem',
              opacity: 0.6
            }}>
              <p style={{ margin: '0 0 0.5rem 0' }}>📄 Documento: <strong>{generation?.modelName} v{generation?.modelVersion}</strong></p>
              <p style={{ margin: '0 0 0.5rem 0' }}>🔐 Hash DNA: <code style={{ fontSize: '0.7rem' }}>{generation?.hash}</code></p>
              <p style={{ margin: 0 }}>📍 Origem: <strong>{typeof window !== 'undefined' ? window.location.hostname : ''}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
