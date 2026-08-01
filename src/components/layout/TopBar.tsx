"use client";

import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { AI_MODELS } from "@/constants/data";
import { AIModel } from "@/types";

interface TopBarProps {
  selectedModel: AIModel;
  modelOpen: boolean;
  onModelToggle: () => void;
  onModelSelect: (m: AIModel) => void;
  onSidebarToggle: () => void;
}

const MODEL_INFO: Record<AIModel, { desc: string; icon: string; color: string }> = {
  "Nyay Standard": { desc: "Practical Legal Advisory & Action Steps", icon: "⚡", color: "#4F8EF7" },
  "Nyay Research": { desc: "Case Precedents & Statutory Mappings", icon: "🔬", color: "#818CF8" },
  "Nyay Pro": { desc: "Judicial Bench Opinion & Dual-Party Synthesis", icon: "⚖️", color: C.gold },
};

const ACTION_BTNS = [
  { icon: Icons.refresh, label: "Regenerate" },
  { icon: Icons.share, label: "Share" },
  { icon: Icons.copy, label: "Copy" },
];

export default function TopBar({ selectedModel, modelOpen, onModelToggle, onModelSelect, onSidebarToggle }: TopBarProps) {
  const currentInfo = MODEL_INFO[selectedModel] || MODEL_INFO["Nyay Pro"];

  return (
    <header
      style={{
        height: 52,
        background: C.panel,
        borderBottom: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Sidebar Toggle Button in Top-Left Corner */}
      <button
        onClick={onSidebarToggle}
        title="Toggle Sidebar"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "6px 10px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.text,
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        ☰
      </button>

      {/* Model selector dropdown */}
      <div style={{ position: "relative" }}>
        <button
          onClick={onModelToggle}
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: C.text,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <span style={{ fontSize: 13 }}>{currentInfo.icon}</span>
          <span style={{ color: currentInfo.color }}>{selectedModel}</span>
          <span style={{ color: C.textDim, fontSize: 11, fontWeight: 400 }}>· {currentInfo.desc.split("&")[0]}</span>
          <Icon d={Icons.chevronDown} size={13} color={C.textMuted} />
        </button>

        {modelOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              background: C.panel,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              overflow: "hidden",
              zIndex: 50,
              width: 320,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              padding: "6px",
            }}
          >
            <div style={{ color: C.textDim, fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", padding: "6px 10px 4px" }}>
              Select Legal AI Engine
            </div>
            {AI_MODELS.map((m) => {
              const info = MODEL_INFO[m];
              const isSel = selectedModel === m;
              return (
                <button
                  key={m}
                  onClick={() => onModelSelect(m)}
                  style={{
                    width: "100%",
                    background: isSel ? C.surfaceHov : "none",
                    border: `1px solid ${isSel ? info.color + "40" : "transparent"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    padding: "10px 12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 4,
                    textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 16, marginTop: 1 }}>{info.icon}</span>
                  <div>
                    <div style={{ color: isSel ? info.color : C.text, fontSize: 13, fontWeight: 600 }}>{m}</div>
                    <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{info.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Action buttons */}
      {ACTION_BTNS.map((a) => (
        <button
          key={a.label}
          title={a.label}
          style={{
            background: "none",
            border: `1px solid ${C.border}`,
            borderRadius: 7,
            padding: "6px 8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon d={a.icon} size={15} color={C.textMuted} />
        </button>
      ))}
    </header>
  );
}
