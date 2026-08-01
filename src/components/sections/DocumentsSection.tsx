"use client";

import { useState, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { DOC_TEMPLATES, DOC_CATEGORIES } from "@/constants/data";
import { DocTemplate } from "@/types";

export default function DocumentsSection() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<DocTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Contract Risk Analysis state
  const [analysisMode, setAnalysisMode] = useState(false);
  const [contractText, setContractText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = DOC_TEMPLATES.filter((t) => category === "All" || t.category === category);

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setGenerated(null);
    try {
      const fieldsSummary = selected.fields.map((f) => `${f}: ${formData[f] || "[not provided]"}`).join(", ");
      const prompt = `Draft a professional ${selected.title} for Indian jurisdiction. Details: ${fieldsSummary}. Include all standard clauses, governing law as India, recitals, representations, and warranties. Format as a formal legal deed.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      setGenerated(data.content);
    } catch {
      setGenerated("⚠️ Failed to generate document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeContract = async () => {
    if (!contractText.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: contractText }),
      });
      const data = await res.json();
      setAnalysisResult(data.content);
    } catch {
      setAnalysisResult("⚠️ Failed to analyze contract risk. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setContractText(evt.target?.result as string || "");
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = (content: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (analysisMode) {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", maxWidth: 840, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <button
          onClick={() => {
            setAnalysisMode(false);
            setAnalysisResult(null);
            setContractText("");
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.textMuted,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          ← Back to Document Templates
        </button>

        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔍 AI Contract Risk Analysis</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 20 }}>
          Upload or paste any agreement to identify red-flag clauses, uncapped liabilities, missing provisions, and risk level under Indian law.
        </p>

        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.doc,.docx,.pdf" style={{ display: "none" }} />

        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 500 }}>Contract / Agreement Text</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", color: C.gold, fontSize: 12, cursor: "pointer" }}
            >
              📁 Upload Document File
            </button>
          </div>
          <textarea
            value={contractText}
            onChange={(e) => setContractText(e.target.value)}
            placeholder="Paste contract text here or click 'Upload Document File' above…"
            rows={8}
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "12px",
              color: C.text,
              fontSize: 13,
              lineHeight: 1.6,
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "monospace",
            }}
          />
        </div>

        <button
          onClick={handleAnalyzeContract}
          disabled={analyzing || !contractText.trim()}
          style={{
            background: analyzing || !contractText.trim() ? C.border : C.gold,
            border: "none",
            borderRadius: 9,
            padding: "11px 24px",
            cursor: analyzing || !contractText.trim() ? "not-allowed" : "pointer",
            color: analyzing || !contractText.trim() ? C.textDim : "#05061A",
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {analyzing ? "Analyzing Risk…" : "🔍 Run Legal Risk Analysis"}
        </button>

        {analysisResult && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: C.text, fontWeight: 600, fontSize: 15 }}>Legal Risk Assessment</span>
              <button
                onClick={() => navigator.clipboard.writeText(analysisResult)}
                style={{ background: C.goldGlow, border: `1px solid ${C.gold}30`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", color: C.gold, fontSize: 12 }}
              >
                Copy Analysis
              </button>
            </div>
            <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{analysisResult}</pre>
          </div>
        )}
      </div>
    );
  }

  if (selected) {
    return (
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px", maxWidth: 800, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        {/* Back */}
        <button
          onClick={() => {
            setSelected(null);
            setGenerated(null);
            setFormData({});
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: C.textMuted,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          ← Back to Templates
        </button>

        <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{selected.title}</h2>
        <p style={{ color: C.textMuted, fontSize: 13, marginBottom: 24 }}>{selected.desc}</p>

        {/* Fields */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
          {selected.fields.map((field) => (
            <div key={field}>
              <label style={{ color: C.textMuted, fontSize: 12, fontWeight: 500, display: "block", marginBottom: 6 }}>{field}</label>
              <input
                value={formData[field] || ""}
                onChange={(e) => setFormData((p) => ({ ...p, [field]: e.target.value }))}
                placeholder={`Enter ${field}…`}
                style={{
                  width: "100%",
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: loading ? C.border : C.gold,
            border: "none",
            borderRadius: 9,
            padding: "11px 24px",
            cursor: loading ? "not-allowed" : "pointer",
            color: loading ? C.textDim : "#05061A",
            fontSize: 14,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          {loading ? "Drafting Legal Document…" : "✦ Generate with Nyay.ai"}
        </button>

        {/* Generated doc */}
        {generated && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>Generated Document</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleDownload(generated, `${selected.title.replace(/\s+/g, "_")}.txt`)}
                  style={{
                    background: C.blueSoft,
                    border: `1px solid ${C.blue}40`,
                    borderRadius: 6,
                    padding: "5px 12px",
                    cursor: "pointer",
                    color: C.blue,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  📥 Download File
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(generated)}
                  style={{
                    background: C.goldGlow,
                    border: `1px solid ${C.gold}30`,
                    borderRadius: 6,
                    padding: "5px 12px",
                    cursor: "pointer",
                    color: C.gold,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
            <pre style={{ color: C.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>{generated}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📄 Document Generator & Risk Analyzer</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>AI-drafted Indian legal agreements and instant contract risk scanning</p>
          </div>
          <button
            onClick={() => setAnalysisMode(true)}
            style={{
              background: C.blueSoft,
              border: `1px solid ${C.blue}50`,
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              color: C.blue,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🔍 Contract Risk Analysis
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
          {DOC_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? C.gold : C.surface,
                border: `1px solid ${category === cat ? C.gold : C.border}`,
                borderRadius: 20,
                padding: "5px 14px",
                cursor: "pointer",
                color: category === cat ? "#05061A" : C.textMuted,
                fontSize: 12,
                fontWeight: category === cat ? 600 : 400,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Template grid */}
      <div style={{ padding: "16px 28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {filtered.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.gold;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: C.goldGlow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon d={t.icon} size={17} color={C.gold} />
              </div>
              <div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{t.title}</div>
                <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.4 }}>{t.desc}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.textDim, fontSize: 11 }}>{t.fields.length} fields required</span>
              <span style={{ color: C.gold, fontSize: 12, fontWeight: 500 }}>Generate →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
