"use client";

import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { MODEL_QUICK_PROMPTS, INDIAN_ACTS } from "@/constants/data";
import { AIModel } from "@/types";

interface WelcomeProps {
  onPrompt: (text: string) => void;
  selectedModel?: AIModel;
}

const MODEL_WELCOME: Record<AIModel, { title: string; subtitle: string; icon: string; badge: string; color: string; principle: string }> = {
  "Nyay Standard": {
    title: "Welcome to Nyay Standard Mode",
    subtitle: "Fast, practical Indian legal advisory for day-to-day advocate, business, and client needs.",
    icon: "⚡",
    badge: "Practical Legal Advisory Engine",
    principle: "Core Principle: Pragmatic Legal Advocacy & Actionable Statutory Compliance",
    color: "#4F8EF7",
  },
  "Nyay Research": {
    title: "Welcome to Nyay Research Mode",
    subtitle: "Exhaustive case precedent analysis, landmark AIR/SCC citations, and statutory mapping (IPC/CrPC vs BNS/BNSS/BSA).",
    icon: "🔬",
    badge: "Case Precedents & Statutory Engine",
    principle: "Core Principle: Stare Decisis, Landmark Case Law & Comparative Jurisprudence",
    color: "#818CF8",
  },
  "Nyay Pro": {
    title: "Welcome to Nyay Pro Judicial Suite",
    subtitle: "High-stakes judicial opinion drafting, dual-party argument synthesis (Petitioner vs Respondent), and formal Court Bench decrees.",
    icon: "⚖️",
    badge: "Judicial Bench Opinion & Court Decree",
    principle: "Core Principle: Constitutional Integrity, Dual-Party Synthesis & Judicial Decrees",
    color: C.gold,
  },
};

export default function Welcome({ onPrompt, selectedModel = "Nyay Pro" }: WelcomeProps) {
  const info = MODEL_WELCOME[selectedModel] || MODEL_WELCOME["Nyay Pro"];
  const prompts = MODEL_QUICK_PROMPTS[selectedModel] || MODEL_QUICK_PROMPTS["Nyay Pro"];

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 24px 24px",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${info.color}, ${C.panel})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          fontWeight: 800,
          color: "#fff",
          marginBottom: 16,
          boxShadow: `0 0 30px ${info.color}40`,
        }}
      >
        {info.icon}
      </div>

      {/* Model Mode Banner */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 12 }}>
        <span
          style={{
            background: `${info.color}15`,
            border: `1px solid ${info.color}40`,
            borderRadius: 20,
            padding: "4px 14px",
            color: info.color,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.5px",
          }}
        >
          {info.badge}
        </span>
        <span style={{ color: C.textDim, fontSize: 11, fontStyle: "italic" }}>
          {info.principle}
        </span>
      </div>

      <h1 style={{ color: C.text, fontSize: 24, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.5px", textAlign: "center" }}>
        {info.title}
      </h1>
      <p style={{ color: C.textMuted, fontSize: 13.5, margin: "0 0 28px", textAlign: "center", maxWidth: 540, lineHeight: 1.6 }}>
        {info.subtitle}
      </p>

      {/* Model-Specific Quick Prompt Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, width: "100%", maxWidth: 640, marginBottom: 28 }}>
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onPrompt(p.title)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "16px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = C.surfaceHov;
              (e.currentTarget as HTMLButtonElement).style.borderColor = info.color + "60";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = C.surface;
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={p.icon} size={17} color={p.color} />
            </div>
            <div>
              <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{p.title}</div>
              <div style={{ color: C.textMuted, fontSize: 12, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Indian Acts tag pills */}
      <div style={{ width: "100%", maxWidth: 640 }}>
        <div style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>
          Quick Statutory Access — Indian Acts
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {INDIAN_ACTS.map((act) => (
            <button
              key={act}
              onClick={() => onPrompt(`Explain key provisions of ${act}`)}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "5px 12px",
                cursor: "pointer",
                color: C.textMuted,
                fontSize: 12,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = info.color;
                (e.currentTarget as HTMLButtonElement).style.color = info.color;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                (e.currentTarget as HTMLButtonElement).style.color = C.textMuted;
              }}
            >
              {act}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
