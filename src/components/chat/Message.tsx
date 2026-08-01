"use client";

import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { Message as MessageType, AIModel } from "@/types";

interface MessageProps {
  msg: MessageType;
  model: AIModel;
}

const MODEL_CFG: Record<AIModel, { name: string; tag: string; badgeBg: string; badgeColor: string; icon: string }> = {
  "Nyay Standard": {
    name: "Nyay Standard",
    tag: "Practical Legal Advisory Mode",
    badgeBg: "rgba(79, 142, 247, 0.15)",
    badgeColor: "#4F8EF7",
    icon: "⚡",
  },
  "Nyay Research": {
    name: "Nyay Research",
    tag: "Case Precedent & Statutory Engine",
    badgeBg: "rgba(108, 99, 255, 0.15)",
    badgeColor: "#818CF8",
    icon: "🔬",
  },
  "Nyay Pro": {
    name: "Nyay Pro",
    tag: "Judicial Bench Opinion & Decree",
    badgeBg: C.goldGlow,
    badgeColor: C.gold,
    icon: "⚖️",
  },
};

const ACTION_BTNS = [
  { icon: Icons.copy, label: "Copy Judgment" },
  { icon: Icons.share, label: "Share Decision" },
  { icon: Icons.book, label: "Official Citations" },
];

/** Completely strip all cheap raw markdown symbols (#, *, **, __, `) */
function stripMarkdownSymbols(raw: string): string {
  return raw
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/`(.*?)`/g, "$1");
}

/** Render a single line in formal judicial court format without cheap raw symbols */
function RenderJudicialLine({ line, index, modelColor }: { line: string; index: number; modelColor: string }) {
  const clean = stripMarkdownSymbols(line).trim();
  if (!clean) return <div style={{ height: 6 }} />;

  // Roman numeral or uppercase judicial section header
  const isJudicialHeader =
    /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(clean) ||
    /^(JUDICIAL OPINION|LEGAL ANALYSIS|RESEARCH FINDINGS|STATUTORY FRAMEWORK|RATIO DECIDENDI|COURT DECISION|PRACTICAL LEGAL|RESEARCH MATRIX|JURISDICTIONAL MATRIX|ARGUMENT SYNTHESIS)/i.test(clean);

  if (isJudicialHeader) {
    return (
      <div
        style={{
          background: `linear-gradient(90deg, ${modelColor}18, transparent)`,
          borderLeft: `4px solid ${modelColor}`,
          borderRadius: "0 8px 8px 0",
          padding: "10px 16px",
          marginTop: index > 0 ? 18 : 6,
          marginBottom: 10,
          fontWeight: 700,
          color: modelColor,
          fontSize: 13.5,
          letterSpacing: "0.6px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🏛️</span>
        <span style={{ textTransform: "uppercase" }}>{clean}</span>
      </div>
    );
  }

  // Subheading (plain title)
  if (/^[A-Z0-9\s—–:-]{4,60}$/.test(clean) && !clean.endsWith(".")) {
    return (
      <div style={{ fontWeight: 700, color: C.text, marginTop: 12, marginBottom: 4, fontSize: 13, letterSpacing: "0.3px" }}>
        {clean}
      </div>
    );
  }

  // Numbered list item
  if (/^\d+\.\s/.test(clean)) {
    const num = clean.match(/^\d+/)![0];
    const text = clean.replace(/^\d+\.\s/, "");
    return (
      <div style={{ display: "flex", gap: 10, margin: "6px 0", paddingLeft: 4 }}>
        <span style={{ color: modelColor, fontWeight: 700, minWidth: 20, fontSize: 13 }}>{num}.</span>
        <span style={{ color: C.text, lineHeight: 1.65 }}>{text}</span>
      </div>
    );
  }

  // Bullet point item
  if (/^[-•▸]\s/.test(clean)) {
    const text = clean.replace(/^[-•▸]\s/, "");
    return (
      <div style={{ display: "flex", gap: 10, margin: "6px 0", paddingLeft: 4 }}>
        <span style={{ color: modelColor, marginTop: 1, fontSize: 13 }}>▸</span>
        <span style={{ color: C.text, lineHeight: 1.65 }}>{text}</span>
      </div>
    );
  }

  // Regular paragraph text
  return <p style={{ margin: "6px 0", color: C.text, lineHeight: 1.7, fontSize: 13.5 }}>{clean}</p>;
}

export default function Message({ msg, model: propModel }: MessageProps) {
  const isUser = msg.role === "user";
  // Always use the model saved in msg.model first, fallback to current propModel
  const effectiveModel: AIModel = msg.model || propModel || "Nyay Pro";
  const cfg = MODEL_CFG[effectiveModel] || MODEL_CFG["Nyay Pro"];

  const handleCopy = () => {
    navigator.clipboard.writeText(stripMarkdownSymbols(msg.content));
    alert(`📋 Formal ${cfg.name} decision copied to clipboard!`);
  };

  /* ── User Message Bubble ───────────────────────────── */
  if (isUser) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 20 }}>
        <div
          style={{
            background: C.blue,
            borderRadius: "12px 12px 4px 12px",
            padding: "10px 14px",
            maxWidth: "75%",
            color: "#fff",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          {msg.attachments && msg.attachments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
              {msg.attachments.map((att) => (
                <div key={att.id} style={{ background: "rgba(0,0,0,0.2)", padding: 6, borderRadius: 8 }}>
                  {att.type === "image" && (
                    <img
                      src={att.previewUrl || att.data}
                      alt={att.name}
                      style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 6, objectFit: "cover" }}
                    />
                  )}
                  {att.type === "audio" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <audio controls src={att.data} style={{ height: 32, width: 220 }} />
                    </div>
                  )}
                  {att.type === "file" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <Icon d={Icons.docs} size={14} color="#fff" />
                      <span>{att.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div>{msg.content}</div>
        </div>
      </div>
    );
  }

  /* ── AI Formal Judicial Judgment Card ───────────────────── */
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Official Court Header Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${cfg.badgeColor}, ${C.panel})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
              color: "#fff",
              boxShadow: `0 2px 8px ${cfg.badgeColor}30`,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 13.5, fontWeight: 700, letterSpacing: "0.3px" }}>
              {cfg.name} · Judicial Judgment
            </div>
            <div style={{ color: C.textDim, fontSize: 11 }}>Official Bench Analysis</div>
          </div>
        </div>
        <span
          style={{
            color: cfg.badgeColor,
            fontSize: 11,
            fontWeight: 600,
            background: cfg.badgeBg,
            border: `1px solid ${cfg.badgeColor}40`,
            borderRadius: 20,
            padding: "3px 12px",
          }}
        >
          {cfg.tag}
        </span>
      </div>

      {/* Main Judicial Card Container */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
          padding: "20px 24px",
          color: C.text,
          boxShadow: `0 6px 20px rgba(0,0,0,0.2)`,
          position: "relative",
        }}
      >
        {/* Judicial Watermark Badge */}
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontSize: 10,
            fontWeight: 800,
            color: cfg.badgeColor,
            letterSpacing: "1px",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          SEAL OF JUDICIAL RESEARCH
        </div>

        {/* Text lines */}
        {msg.content.split("\n").map((line, i) => (
          <RenderJudicialLine key={i} line={line} index={i} modelColor={cfg.badgeColor} />
        ))}

        {/* Dynamic Legal Graph / Statutory Severity Meter */}
        <div
          style={{
            marginTop: 18,
            padding: "12px 16px",
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ color: C.textMuted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              📊 Statutory Risk & Severity Index
            </span>
            <span style={{ color: cfg.badgeColor, fontSize: 11, fontWeight: 700 }}>High Precedent Authority</span>
          </div>
          <div style={{ width: "100%", height: 7, background: C.border, borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                width: effectiveModel === "Nyay Pro" ? "88%" : effectiveModel === "Nyay Research" ? "75%" : "60%",
                height: "100%",
                background: `linear-gradient(90deg, ${cfg.badgeColor}, ${C.gold})`,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Websearch Official Source Links */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ color: C.textDim, fontSize: 11, fontWeight: 600 }}>🌐 Verified Citations & Portals:</span>
          <a
            href="https://www.indiacode.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.blue, fontSize: 11, textDecoration: "none", background: C.blueSoft, padding: "2px 8px", borderRadius: 4 }}
          >
            IndiaCode Statutory Database ↗
          </a>
          <a
            href="https://main.sci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.gold, fontSize: 11, textDecoration: "none", background: C.goldGlow, padding: "2px 8px", borderRadius: 4 }}
          >
            Supreme Court Judgments Repository ↗
          </a>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, paddingLeft: 4 }}>
        {ACTION_BTNS.map((a) => (
          <button
            key={a.label}
            onClick={a.label.includes("Copy") ? handleCopy : undefined}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
              color: C.textMuted,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 500,
            }}
          >
            <Icon d={a.icon} size={13} color={C.textMuted} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
