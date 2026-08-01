"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";

interface CaseResearchProps {
  onPrompt: (text: string) => void;
  onCopyToChat?: (text: string) => void;
}

interface CaseItem {
  id?: string;
  name: string;
  citation: string;
  court: string;
  year: string;
  subject: string;
}

const COURTS = ["All Courts", "Supreme Court", "High Courts", "District Courts", "Tribunals", "NCLAT", "NCLT", "NCDRC"];

const SAMPLE_RESULTS: CaseItem[] = [
  { id: "c1", name: "Maneka Gandhi vs. Union of India", citation: "AIR 1978 SC 597", court: "Supreme Court", year: "1978", subject: "Fundamental Rights — Article 21 Procedure established by law" },
  { id: "c2", name: "Kesavananda Bharati vs. State of Kerala", citation: "AIR 1973 SC 1461", court: "Supreme Court", year: "1973", subject: "Basic Structure Doctrine & Judicial Review" },
  { id: "c3", name: "Vishaka vs. State of Rajasthan", citation: "AIR 1997 SC 3011", court: "Supreme Court", year: "1997", subject: "Sexual Harassment at Workplace Guidelines" },
  { id: "c4", name: "M.C. Mehta vs. Union of India", citation: "AIR 1987 SC 1086", court: "Supreme Court", year: "1987", subject: "Environmental Law — Absolute Liability Doctrine" },
  { id: "c5", name: "Shayara Bano vs. Union of India", citation: "(2017) 9 SCC 1", court: "Supreme Court", year: "2017", subject: "Triple Talaq — Constitutional Arbitrariness" },
];

export default function CaseResearch({ onPrompt, onCopyToChat }: CaseResearchProps) {
  const [query, setQuery] = useState("");
  const [court, setCourt] = useState("All Courts");
  const [year, setYear] = useState("");
  const [results, setResults] = useState<CaseItem[]>(SAMPLE_RESULTS);
  const [searched, setSearched] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareItem, setShareItem] = useState<CaseItem | null>(null);

  // Add Case Form state
  const [caseName, setCaseName] = useState("");
  const [citation, setCitation] = useState("");
  const [caseCourt, setCaseCourt] = useState("Supreme Court");
  const [caseYear, setCaseYear] = useState("2024");
  const [subject, setSubject] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
    onPrompt(`Find and analyse case law: "${query}" in ${court !== "All Courts" ? court : "Indian courts"}${year ? ` from ${year}` : ""}. Provide citations, ratio decidendi, and relevance.`);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName.trim() || !citation.trim()) return;

    const newCase: CaseItem = {
      id: "c_" + Date.now(),
      name: caseName.trim(),
      citation: citation.trim(),
      court: caseCourt,
      year: caseYear.trim() || "2024",
      subject: subject.trim() || "Landmark Judicial Precedent under Indian Law",
    };

    setResults((prev) => [newCase, ...prev]);
    setCaseName("");
    setCitation("");
    setSubject("");
    setShowAddModal(false);
  };

  const handleCopyToChat = (r: CaseItem) => {
    const templateText = `[Case Precedent]: ${r.name} (${r.citation}) - ${r.court} ${r.year}\nSubject/Ratio: ${r.subject}\n\nMy Question: `;
    if (onCopyToChat) {
      onCopyToChat(templateText);
    } else {
      onPrompt(`Analyse the judgment: ${r.name} (${r.citation}). Explain ratio decidendi, obiter dicta, and current relevance.`);
    }
  };

  const handleShareClick = (r: CaseItem) => {
    setShareItem(r);
  };

  const handleCopyShare = (r: CaseItem) => {
    const text = `⚖️ Nyay.ai Case Precedent Insight:\nCase: ${r.name}\nCitation: ${r.citation}\nCourt: ${r.court} (${r.year})\nRatio/Subject: ${r.subject}`;
    navigator.clipboard.writeText(text);
    alert("📋 Case research insights copied to clipboard!");
    setShareItem(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>🔍 Case Research & Precedent Index</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>AI-powered search across Supreme Court, High Courts, and Appellate Tribunals</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: C.gold,
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
              color: "#05061A",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon d={Icons.plus} size={14} color="#05061A" /> Add Case Precedent
          </button>
        </div>

        {/* Search box */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Icon d={Icons.search} size={15} color={C.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by case name, citation, subject, or ratio decidendi…"
              style={{
                width: "100%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "10px 12px 10px 36px",
                color: C.text,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              background: C.gold,
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              color: "#05061A",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <select
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              padding: "6px 10px",
              color: C.textMuted,
              fontSize: 12,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {COURTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (e.g. 2023)"
            style={{
              width: 130,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              padding: "6px 10px",
              color: C.textMuted,
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, padding: "16px 28px 24px" }}>
        <div style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 12 }}>
          {searched ? "AI Research Results" : "Landmark Judgments & Precedents"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {results.map((r, i) => (
            <div
              key={r.id || i}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ color: C.gold, fontSize: 11, fontFamily: "monospace" }}>{r.citation}</span>
                  <span style={{ color: C.textDim, fontSize: 11 }}>
                    {r.court} · {r.year}
                  </span>
                </div>
                <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{r.subject}</div>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <button
                  onClick={() => handleCopyToChat(r)}
                  title="Copy case notes to Chat Bar to add custom questions"
                  style={{
                    background: C.surfaceHov,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: C.text,
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                >
                  💬 Copy to Chat
                </button>
                <button
                  onClick={() => handleShareClick(r)}
                  title="Share case precedent"
                  style={{
                    background: C.surfaceHov,
                    border: `1px solid ${C.border}`,
                    borderRadius: 7,
                    padding: "6px 10px",
                    cursor: "pointer",
                    color: C.textMuted,
                    fontSize: 11,
                  }}
                >
                  🔗 Share
                </button>
                <button
                  onClick={() => onPrompt(`Analyse the judgment: ${r.name} (${r.citation}). Explain ratio decidendi, obiter dicta, and current relevance under Indian jurisprudence.`)}
                  style={{
                    background: C.goldGlow,
                    border: `1px solid ${C.gold}30`,
                    borderRadius: 7,
                    padding: "6px 12px",
                    cursor: "pointer",
                    color: C.gold,
                    fontSize: 11,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  Analyse →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Case Precedent Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚖️ Add Case Precedent</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Case Title / Parties</label>
                <input
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g. State vs. Rajesh Kumar"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Citation</label>
                  <input
                    value={citation}
                    onChange={(e) => setCitation(e.target.value)}
                    placeholder="e.g. AIR 2024 SC 1234"
                    required
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Year</label>
                  <input
                    value={caseYear}
                    onChange={(e) => setCaseYear(e.target.value)}
                    placeholder="2024"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Court / Forum</label>
                <select
                  value={caseCourt}
                  onChange={(e) => setCaseCourt(e.target.value)}
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                >
                  {COURTS.filter((c) => c !== "All Courts").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Legal Ratio / Subject Matter</label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Key principle, ratio decidendi, or statutory section discussed…"
                  rows={3}
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box", resize: "none" }}
                />
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: C.gold, border: "none", borderRadius: 8, padding: "8px 18px", color: "#05061A", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                >
                  Save Precedent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🔗 Share Case Precedent</h3>
            <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Share citation & judicial ratio with counsel or team</p>
            <div style={{ background: C.surface, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
              <strong>{shareItem.name} ({shareItem.citation})</strong><br />
              <span style={{ color: C.gold }}>{shareItem.court} · {shareItem.year}</span><br />
              <span style={{ color: C.textMuted }}>{shareItem.subject}</span>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShareItem(null)}
                style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCopyShare(shareItem)}
                style={{ background: C.gold, border: "none", borderRadius: 8, padding: "8px 18px", color: "#05061A", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                📋 Copy Case Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
