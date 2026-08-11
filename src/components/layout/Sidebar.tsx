"use client";

import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { NAV_ITEMS } from "@/constants/data";
import { ChatSession } from "@/types";

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
  activeChat: number;
  onChatSelect: (id: number) => void;
  onNewChat: () => void;
  chatSessions?: ChatSession[];
  onDeleteChat?: (id: number, e: React.MouseEvent) => void;
}

export default function Sidebar({
  open,
  onToggle,
  activeNav,
  onNavChange,
  activeChat,
  onChatSelect,
  onNewChat,
  chatSessions = [],
  onDeleteChat,
}: SidebarProps) {
  const w = open ? 260 : 64;

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease, min-width 0.2s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────── */}
      <div style={{ padding: "16px 14px 10px", display: "flex", alignItems: "center", gap: 10, minHeight: 56 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 14,
            color: "#fff",
          }}
        >
          न्
        </div>

        {open && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: C.text, fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
              Nyay<span style={{ color: C.gold }}>.ai</span>
            </div>
            <div style={{ color: C.textDim, fontSize: 10, letterSpacing: "0.8px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
              Legal Intelligence
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 6, flexShrink: 0 }}>
          <Icon d={Icons.menu} size={16} color={C.textMuted} />
        </button>
      </div>

      {/* ── New Chat ─────────────────────────────── */}
      <div style={{ padding: "8px 10px 4px" }}>
        <button
          onClick={onNewChat}
          style={{
            width: "100%",
            background: C.goldGlow,
            border: `1px solid ${C.goldDim}40`,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: open ? "8px 12px" : "8px",
            justifyContent: open ? "flex-start" : "center",
            color: C.gold,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <Icon d={Icons.plus} size={16} color={C.gold} />
          {open && <span>New Chat</span>}
        </button>
      </div>

      {/* ── Navigation ───────────────────────────── */}
      <div style={{ padding: "12px 10px 4px" }}>
        {open && (
          <div style={{ color: C.textDim, fontSize: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", padding: "0 4px 8px" }}>
            Navigation
          </div>
        )}
        {NAV_ITEMS.map((n) => {
          const active = activeNav === n.id;
          return (
            <button
              key={n.id}
              onClick={() => onNavChange(n.id)}
              style={{
                width: "100%",
                background: active ? C.sidebarHov : "none",
                border: active ? `1px solid ${C.border}` : "1px solid transparent",
                borderRadius: 7,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: open ? "8px 10px" : "8px",
                justifyContent: open ? "flex-start" : "center",
                color: active ? C.text : C.textMuted,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                marginBottom: 2,
              }}
            >
              <Icon d={n.icon} size={16} color={active ? C.gold : C.textMuted} />
              {open && <span>{n.label}</span>}
            </button>
          );
        })}
      </div>

      {/* ── Persistent Chat History ─────────────────────────── */}
      {open && (
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", scrollbarWidth: "thin", scrollbarColor: `${C.border} transparent` }}>
          <div style={{ color: C.textDim, fontSize: 10, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", padding: "4px 4px 8px" }}>
            Recent Chats ({chatSessions.length})
          </div>
          {chatSessions.map((h) => {
            const active = activeChat === h.id;
            return (
              <div
                key={h.id}
                onClick={() => onChatSelect(h.id)}
                style={{
                  width: "100%",
                  background: active ? C.sidebarHov : "none",
                  border: active ? `1px solid ${C.border}` : "1px solid transparent",
                  borderRadius: 7,
                  cursor: "pointer",
                  padding: "7px 10px",
                  marginBottom: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      color: active ? C.text : C.textMuted,
                      fontSize: 12,
                      fontWeight: active ? 600 : 400,
                      lineHeight: 1.4,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {h.title}
                  </div>
                  <div style={{ color: C.textDim, fontSize: 10, marginTop: 2, display: "flex", gap: 6, alignItems: "center" }}>
                    <span>{h.date}</span>
                    <span>·</span>
                    <span style={{ color: h.model === "Nyay Pro" ? C.gold : h.model === "Nyay Research" ? "#818CF8" : "#4F8EF7" }}>
                      {h.model || "Nyay Pro"}
                    </span>
                  </div>
                </div>

                {onDeleteChat && (
                  <button
                    onClick={(e) => onDeleteChat(h.id, e)}
                    title="Delete Chat"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: 4,
                      color: C.textDim,
                      opacity: active ? 1 : 0.4,
                    }}
                  >
                    <Icon d={Icons.trash} size={13} color={C.textDim} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── User Profile ─────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "10px" }}>
        <button
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: open ? "6px" : "6px",
            justifyContent: open ? "flex-start" : "center",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              flexShrink: 0,
              background: `linear-gradient(135deg, ${C.gold}, ${C.indigoDeep})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            L
          </div>
          {open && (
            <div style={{ flex: 1, overflow: "hidden", textAlign: "left" }}>
              <div style={{ color: C.text, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Lakshya
              </div>
              <div style={{ color: C.textDim, fontSize: 10 }}>Pro Plan</div>
            </div>
          )}
          {open && <Icon d={Icons.settings} size={14} color={C.textDim} />}
        </button>
      </div>
    </aside>
  );
}
