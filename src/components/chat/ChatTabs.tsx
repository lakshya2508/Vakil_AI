"use client";

import { ChatTab } from "@/types";
import { C } from "@/constants/colors";

const TABS: { id: ChatTab; label: string; emoji: string }[] = [
  { id: "legal-chat",    label: "Legal Chat",    emoji: "💬" },
  { id: "law-library",   label: "Law Library",   emoji: "📚" },
  { id: "documents",     label: "Documents",     emoji: "📄" },
  { id: "case-research", label: "Case Research", emoji: "🔍" },
  { id: "compliance",    label: "Compliance",    emoji: "✅" },
];

interface ChatTabsProps {
  activeTab:  ChatTab;
  onTabChange: (tab: ChatTab) => void;
}

export default function ChatTabs({ activeTab, onTabChange }: ChatTabsProps) {
  return (
    <div style={{
      display:      "flex",
      gap:          2,
      padding:      "10px 16px 0",
      background:   C.panel,
      borderBottom: `1px solid ${C.border}`,
      overflowX:    "auto",
      flexShrink:   0,
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background:    active ? C.bg : "none",
              border:        `1px solid ${active ? C.border : "transparent"}`,
              borderBottom:  active ? `1px solid ${C.bg}` : "1px solid transparent",
              borderRadius:  "8px 8px 0 0",
              padding:       "8px 16px",
              cursor:        "pointer",
              color:         active ? C.text : C.textMuted,
              fontSize:      13,
              fontWeight:    active ? 600 : 400,
              whiteSpace:    "nowrap",
              display:       "flex",
              alignItems:    "center",
              gap:           6,
              marginBottom:  active ? -1 : 0,
              transition:    "all 0.15s",
            }}
          >
            <span style={{ fontSize: 13 }}>{tab.emoji}</span>
            {tab.label}
            {active && (
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: C.gold, marginLeft: 2,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
