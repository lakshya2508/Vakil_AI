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
    badgeBg: "rgba(79, 142, 247, 0.18)",
    badgeColor: "#4F8EF7",
    icon: "⚡",
  },
  "Nyay Research": {
    name: "Nyay Research",
    tag: "Case Precedent & Statutory Engine",
    badgeBg: "rgba(108, 99, 255, 0.18)",
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

/** Parse text inline to render **bold text** properly as strong element */
function renderFormattedInlineText(text: string) {
  // Strip raw # headers if any slipped in
  const clean = text.replace(/^#{1,6}\s*/, "");
  const parts = clean.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);

  return parts.map((part, idx) => {
    if (
      (part.startsWith("**") && part.endsWith("**")) ||
      (part.startsWith("__") && part.endsWith("__"))
    ) {
      return (
        <strong key={idx} style={{ fontWeight: 700, color: "#FFFFFF" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={idx} style={{ fontStyle: "italic", color: C.textMuted }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

/** Render line in high-court formal judicial bench format */
function RenderJudicialLine({ line, index, modelColor }: { line: string; index: number; modelColor: string }) {
  const trimmed = line.trim();
  if (!trimmed) return <div style={{ height: 8 }} />;

  // Table row detection
  if (trimmed.includes("|")) {
    const cols = trimmed.split("|").map((c) => c.trim()).filter((c) => c !== "");
    const isHeaderRow = trimmed.toLowerCase().includes("old act") || trimmed.toLowerCase().includes("section") || index === 0;
    
    if (cols.length >= 2) {
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
            gap: 8,
            background: isHeaderRow ? `rgba(255,255,255,0.06)` : C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            padding: "8px 12px",
            margin: "4px 0",
            fontSize: 13.5,
            fontWeight: isHeaderRow ? 700 : 500,
            color: isHeaderRow ? modelColor : C.text,
          }}
        >
          {cols.map((col, cIdx) => (
            <div key={cIdx}>{renderFormattedInlineText(col)}</div>
          ))}
        </div>
      );
    }
  }

  // Roman numeral or main Judicial Section Header
  const isJudicialHeader =
    /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/i.test(trimmed) ||
    /^(JUDICIAL OPINION|LEGAL ANALYSIS|RESEARCH FINDINGS|STATUTORY FRAMEWORK|RATIO DECIDENDI|COURT DECISION|PRACTICAL LEGAL|RESEARCH MATRIX|JURISDICTIONAL MATRIX|ARGUMENT SYNTHESIS|BENCH DECREE)/i.test(trimmed);

  if (isJudicialHeader) {
    return (
      <div
        style={{
          background: `linear-gradient(90deg, ${modelColor}22, transparent)`,
          borderLeft: `5px solid ${modelColor}`,
          borderRadius: "0 10px 10px 0",
          padding: "12px 18px",
          marginTop: index > 0 ? 22 : 6,
          marginBottom: 12,
          fontWeight: 800,
          color: modelColor,
          fontSize: 15,
          letterSpacing: "0.7px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 16 }}>🏛️</span>
        <span style={{ textTransform: "uppercase" }}>{renderFormattedInlineText(trimmed)}</span>
      </div>
    );
  }

  // Legal Subheading / Case Party Title
  if (/^([A-Z0-9\s—–:-]{4,70})$/.test(trimmed) && !trimmed.endsWith(".")) {
    return (
      <div
        style={{
          fontWeight: 800,
          color: "#FFFFFF",
          marginTop: 14,
          marginBottom: 6,
          fontSize: 14.5,
          letterSpacing: "0.4px",
          borderBottom: `1px solid ${C.border}`,
          paddingBottom: 4,
        }}
      >
        {renderFormattedInlineText(trimmed)}
      </div>
    );
  }

  // Numbered Judicial Point
  if (/^\d+\.\s/.test(trimmed)) {
    const num = trimmed.match(/^\d+/)![0];
    const rest = trimmed.replace(/^\d+\.\s/, "");
    
    // Check if point has a title prefix like "Legal Rights: Under Indian..."
    const titleMatch = rest.match(/^([^:]+:)(.*)$/);

    return (
      <div style={{ display: "flex", gap: 12, margin: "8px 0", paddingLeft: 4 }}>
        <span style={{ color: modelColor, fontWeight: 800, minWidth: 24, fontSize: 14.5 }}>{num}.</span>
        <div style={{ color: C.text, lineHeight: 1.7, fontSize: 14.5 }}>
          {titleMatch ? (
            <>
              <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>{titleMatch[1]}</strong>
              {renderFormattedInlineText(titleMatch[2])}
            </>
          ) : (
            renderFormattedInlineText(rest)
          )}
        </div>
      </div>
    );
  }

  // Bullet Point Item
  if (/^[-•▸]\s/.test(trimmed)) {
    const rest = trimmed.replace(/^[-•▸]\s/, "");
    const titleMatch = rest.match(/^([^:]+:)(.*)$/);

    return (
      <div style={{ display: "flex", gap: 12, margin: "8px 0", paddingLeft: 6 }}>
        <span style={{ color: modelColor, marginTop: 2, fontSize: 14, fontWeight: 800 }}>▸</span>
        <div style={{ color: C.text, lineHeight: 1.7, fontSize: 14.5 }}>
          {titleMatch ? (
            <>
              <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>{titleMatch[1]}</strong>
              {renderFormattedInlineText(titleMatch[2])}
            </>
          ) : (
            renderFormattedInlineText(rest)
          )}
        </div>
      </div>
    );
  }

  // Regular Paragraph Text
  return (
    <p style={{ margin: "8px 0", color: C.text, lineHeight: 1.75, fontSize: 14.5, fontWeight: 400 }}>
      {renderFormattedInlineText(trimmed)}
    </p>
  );
}

export default function Message({ msg, model: propModel }: MessageProps) {
  const isUser = msg.role === "user";
  const effectiveModel: AIModel = msg.model || propModel || "Nyay Pro";
  const cfg = MODEL_CFG[effectiveModel] || MODEL_CFG["Nyay Pro"];

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    alert(`📋 Formal ${cfg.name} decision copied to clipboard!`);
  };

  /* ── User Message Bubble ───────────────────────────── */
  if (isUser) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: 22 }}>
        <div
          style={{
            background: C.blue,
            borderRadius: "14px 14px 4px 14px",
            padding: "12px 16px",
            maxWidth: "75%",
            color: "#fff",
            fontSize: 14.5,
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          {msg.attachments && msg.attachments.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
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
    <div style={{ marginBottom: 30 }}>
      {/* Official Court Header Banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${cfg.badgeColor}, ${C.panel})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 800,
              color: "#fff",
              boxShadow: `0 3px 10px ${cfg.badgeColor}35`,
            }}
          >
            {cfg.icon}
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 14.5, fontWeight: 800, letterSpacing: "0.3px" }}>
              {cfg.name} · Judicial Bench Decision
            </div>
            <div style={{ color: C.textDim, fontSize: 11.5 }}>Official Judicial Analysis & Decree</div>
          </div>
        </div>
        <span
          style={{
            color: cfg.badgeColor,
            fontSize: 11.5,
            fontWeight: 700,
            background: cfg.badgeBg,
            border: `1px solid ${cfg.badgeColor}50`,
            borderRadius: 20,
            padding: "4px 14px",
            letterSpacing: "0.3px",
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
          padding: "22px 26px",
          color: C.text,
          boxShadow: `0 8px 24px rgba(0,0,0,0.25)`,
          position: "relative",
        }}
      >
        {/* Judicial Watermark Badge */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            fontSize: 10.5,
            fontWeight: 900,
            color: cfg.badgeColor,
            letterSpacing: "1.2px",
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          SEAL OF JUDICIAL BENCH
        </div>

        {/* Text lines */}
        {msg.content.split("\n").map((line, i) => (
          <RenderJudicialLine key={i} line={line} index={i} modelColor={cfg.badgeColor} />
        ))}

        {/* Dynamic Legal Graph / Statutory Severity Meter */}
        <div
          style={{
            marginTop: 22,
            padding: "14px 18px",
            background: C.panel,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: C.textMuted, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px" }}>
              📊 Statutory Precedent Risk & Severity Index
            </span>
            <span style={{ color: cfg.badgeColor, fontSize: 12, fontWeight: 800 }}>High Supreme Court Authority</span>
          </div>
          <div style={{ width: "100%", height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                width: effectiveModel === "Nyay Pro" ? "92%" : effectiveModel === "Nyay Research" ? "80%" : "68%",
                height: "100%",
                background: `linear-gradient(90deg, ${cfg.badgeColor}, ${C.gold})`,
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        {/* Websearch Official Source Links */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ color: C.textDim, fontSize: 11.5, fontWeight: 700 }}>🌐 Official Citation Repositories:</span>
          <a
            href="https://www.indiacode.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.blue, fontSize: 11.5, textDecoration: "none", background: C.blueSoft, padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}
          >
            IndiaCode Statutory Database ↗
          </a>
          <a
            href="https://main.sci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: C.gold, fontSize: 11.5, textDecoration: "none", background: C.goldGlow, padding: "3px 10px", borderRadius: 4, fontWeight: 600 }}
          >
            Supreme Court Judgments Portal ↗
          </a>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 12, paddingLeft: 4 }}>
        {ACTION_BTNS.map((a) => (
          <button
            key={a.label}
            onClick={a.label.includes("Copy") ? handleCopy : undefined}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 14px",
              cursor: "pointer",
              color: C.textMuted,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 600,
            }}
          >
            <Icon d={a.icon} size={14} color={C.textMuted} />
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
