"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { LAW_ACTS, LAW_CATEGORIES } from "@/constants/data";
import { LawAct } from "@/types";

interface LawLibraryProps {
  onPrompt: (text: string) => void;
  onCopyToChat?: (text: string) => void;
}

export default function LawLibrary({ onPrompt, onCopyToChat }: LawLibraryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [acts, setActs] = useState<LawAct[]>(LAW_ACTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareItem, setShareItem] = useState<LawAct | null>(null);

  // Form states for Add Law
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("2024");
  const [lawCategory, setLawCategory] = useState("Constitutional");
  const [sections, setSections] = useState("100");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("Provisions, Amendment");

  const filtered = acts.filter((a) => {
    const matchCat = category === "All" || a.category === category;
    const matchQ =
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchQ;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAct: LawAct = {
      id: "act_" + Date.now(),
      title: title.trim(),
      year: year.trim() || "2024",
      category: lawCategory,
      sections: parseInt(sections) || 100,
      summary: summary.trim() || "Key statutory provisions and governance framework under Indian jurisdiction.",
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    setActs((prev) => [newAct, ...prev]);
    setTitle("");
    setSummary("");
    setShowAddModal(false);
  };

  const handleCopyToChat = (act: LawAct) => {
    const templateText = `[Law Reference]: ${act.title} (${act.year}) - ${act.category}\nSummary: ${act.summary}\n\nMy Question: `;
    if (onCopyToChat) {
      onCopyToChat(templateText);
    } else {
      onPrompt(`Explain key provisions and application of ${act.title} (${act.year})`);
    }
  };

  const handleShareClick = (act: LawAct) => {
    setShareItem(act);
  };

  const handleCopyShareLink = (act: LawAct) => {
    const shareText = `📜 Nyay.ai Legal Insight: ${act.title} (${act.year})\nCategory: ${act.category}\nSummary: ${act.summary}\nTags: ${act.tags.join(", ")}`;
    navigator.clipboard.writeText(shareText);
    alert("📋 Law insights copied to clipboard for sharing!");
    setShareItem(null);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📚 Law Library & Statutory Index</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>Browse Indian statutes, criminal codes, constitutional acts, and legal precedents</p>
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
            <Icon d={Icons.plus} size={14} color="#05061A" /> Add Law / Act
          </button>
        </div>

        {/* Search */}
        <div style={{ position: "relative" }}>
          <Icon d={Icons.search} size={15} color={C.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search acts, statutory sections, keywords…"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "9px 12px 9px 36px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
          {LAW_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: category === cat ? C.gold : C.surface,
                border: `1px solid ${category === cat ? C.gold : C.border}`,
                borderRadius: 20,
                padding: "4px 12px",
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

      {/* Acts grid */}
      <div style={{ flex: 1, padding: "16px 28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 12, alignContent: "start" }}>
        {filtered.map((act) => (
          <div
            key={act.id}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ color: C.text, fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{act.title}</div>
                  <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{act.year} · {act.sections} Sections</div>
                </div>
                <span
                  style={{
                    background: C.goldGlow,
                    border: `1px solid ${C.gold}30`,
                    borderRadius: 20,
                    padding: "2px 8px",
                    color: C.gold,
                    fontSize: 10,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {act.category}
                </span>
              </div>
              <p style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{act.summary}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {act.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: C.indigoSoft,
                      border: `1px solid ${C.borderLight}`,
                      borderRadius: 4,
                      padding: "2px 7px",
                      color: C.indigo,
                      fontSize: 10,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              <button
                onClick={() => handleCopyToChat(act)}
                title="Copy provisions to Chat Bar & customize"
                style={{
                  flex: 1,
                  background: C.surfaceHov,
                  border: `1px solid ${C.border}`,
                  borderRadius: 7,
                  padding: "7px 10px",
                  cursor: "pointer",
                  color: C.text,
                  fontSize: 11,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                💬 Copy to Chat
              </button>
              <button
                onClick={() => handleShareClick(act)}
                title="Share law insights"
                style={{
                  background: C.surfaceHov,
                  border: `1px solid ${C.border}`,
                  borderRadius: 7,
                  padding: "7px 10px",
                  cursor: "pointer",
                  color: C.textMuted,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                🔗 Share
              </button>
              <button
                onClick={() => onPrompt(`Explain key provisions, landmark judgments, and legal standards of ${act.title} (${act.year}) under Indian law.`)}
                style={{
                  flex: 1,
                  background: C.goldGlow,
                  border: `1px solid ${C.gold}30`,
                  borderRadius: 7,
                  padding: "7px 10px",
                  cursor: "pointer",
                  color: C.gold,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                Analyze →
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: C.textMuted }}>
            No acts found for &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* Add Law Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📚 Add New Act / Statute</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Act Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bharatiya Sakshya Adhiniyam"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Year</label>
                  <input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2023"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Category</label>
                  <select
                    value={lawCategory}
                    onChange={(e) => setLawCategory(e.target.value)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  >
                    {LAW_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Sections</label>
                  <input
                    type="number"
                    value={sections}
                    onChange={(e) => setSections(e.target.value)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Statutory Summary</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Provide a short summary of provisions…"
                  rows={3}
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box", resize: "none" }}
                />
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Tags (comma-separated)</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Evidence, Electronic Records, Certificate"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
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
                  Save Act
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
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>🔗 Share Law Insight</h3>
            <p style={{ color: C.textMuted, fontSize: 12, marginBottom: 16 }}>Share statutory details & Nyay AI notes with colleagues or clients</p>
            <div style={{ background: C.surface, padding: 12, borderRadius: 8, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
              <strong>{shareItem.title} ({shareItem.year})</strong><br />
              <span style={{ color: C.textMuted }}>{shareItem.summary}</span>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShareItem(null)}
                style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCopyShareLink(shareItem)}
                style={{ background: C.gold, border: "none", borderRadius: 8, padding: "8px 18px", color: "#05061A", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
              >
                📋 Copy Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
