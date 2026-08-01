"use client";

import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { COMPLIANCE_ITEMS } from "@/constants/data";
import { ComplianceLevel } from "@/types";

interface ComplianceTabProps {
  onPrompt: (text: string) => void;
}

const LEVEL_CONFIG: Record<ComplianceLevel, { color: string; bg: string; icon: string }> = {
  "Compliant":        { color: C.green, bg: C.greenSoft,  icon: Icons.check   },
  "Review":           { color: C.amber, bg: C.amberSoft,  icon: Icons.warning },
  "Action Required":  { color: C.red,   bg: C.redSoft,    icon: Icons.close   },
};

const STATS = [
  { label: "Total Checks", value: "6",  color: C.gold  },
  { label: "Compliant",    value: "2",  color: C.green },
  { label: "Under Review", value: "2",  color: C.amber },
  { label: "Action Needed",value: "2",  color: C.red   },
];

export default function ComplianceTab({ onPrompt }: ComplianceTabProps) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>✅ Compliance Dashboard</h2>
        <p style={{ color: C.textMuted, fontSize: 13 }}>Track regulatory obligations across Indian laws</p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "12px 14px",
            }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance list */}
      <div style={{ padding: "16px 28px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4 }}>
          Compliance Items
        </div>
        {COMPLIANCE_ITEMS.map(item => {
          const cfg = LEVEL_CONFIG[item.level];
          return (
            <div key={item.id} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: "14px 16px",
              display: "flex", gap: 14, alignItems: "flex-start",
            }}>
              {/* Status icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon d={cfg.icon} size={16} color={cfg.color} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{item.law}</div>
                  <span style={{
                    background: cfg.bg, border: `1px solid ${cfg.color}30`,
                    borderRadius: 20, padding: "2px 10px",
                    color: cfg.color, fontSize: 11, fontWeight: 600,
                  }}>{item.level}</span>
                </div>
                <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>{item.area}</div>
                <div style={{ color: C.textDim, fontSize: 12, marginBottom: 10 }}>{item.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, fontSize: 11 }}>
                    <Icon d={Icons.calendar} size={12} color={C.textDim} />
                    Due: {item.due}
                  </div>
                  <button onClick={() => onPrompt(`Explain compliance requirements under ${item.law} for ${item.area}. What steps should I take to ensure full compliance?`)} style={{
                    background: C.goldGlow, border: `1px solid ${C.gold}30`,
                    borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                    color: C.gold, fontSize: 11, fontWeight: 500,
                  }}>
                    Get Guidance →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
