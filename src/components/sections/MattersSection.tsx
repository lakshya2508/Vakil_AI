"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { Matter, MatterStatus } from "@/types";

interface MattersSectionProps {
  matters: Matter[];
  onAddMatter: (m: Omit<Matter, "id">) => void;
  onUpdateStatus: (id: number, status: MatterStatus) => void;
}

const STATUS_CFG: Record<MatterStatus, { color: string; bg: string }> = {
  Active: { color: C.green, bg: C.greenSoft },
  Hearing: { color: C.gold, bg: C.goldGlow },
  Disposed: { color: C.textDim, bg: `${C.textDim}15` },
  "On Hold": { color: C.amber, bg: C.amberSoft },
};

const FILTERS: (MatterStatus | "All")[] = ["All", "Active", "Hearing", "On Hold", "Disposed"];

export default function MattersSection({ matters, onAddMatter, onUpdateStatus }: MattersSectionProps) {
  const [filter, setFilter] = useState<MatterStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [court, setCourt] = useState("");
  const [nextDate, setNextDate] = useState("15 Aug 2025");
  const [type, setType] = useState("Civil");
  const [status, setStatus] = useState<MatterStatus>("Active");

  const filtered = matters.filter((m) => {
    const matchFilter = filter === "All" || m.status === filter;
    const matchSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.client.toLowerCase().includes(search.toLowerCase()) ||
      m.court.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const activeCount = matters.filter((m) => m.status === "Active").length;
  const hearingCount = matters.filter((m) => m.status === "Hearing").length;
  const disposedCount = matters.filter((m) => m.status === "Disposed").length;

  const STATS = [
    { label: "Total Matters", value: `${matters.length}`, color: C.gold },
    { label: "Active", value: `${activeCount}`, color: C.green },
    { label: "Hearings", value: `${hearingCount}`, color: C.blue },
    { label: "Disposed", value: `${disposedCount}`, color: C.textDim },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) return;

    onAddMatter({
      title: title.trim(),
      client: client.trim(),
      court: court.trim() || "District Court",
      nextDate: nextDate.trim() || "—",
      status,
      type,
    });

    setTitle("");
    setClient("");
    setCourt("");
    setShowModal(false);
  };

  const cycleStatus = (id: number, current: MatterStatus) => {
    const sequence: MatterStatus[] = ["Active", "Hearing", "On Hold", "Disposed"];
    const idx = sequence.indexOf(current);
    const next = sequence[(idx + 1) % sequence.length];
    onUpdateStatus(id, next);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>⚖️ Matters & Case Litigation</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>Manage active court cases, jurisdiction, and hearing schedules</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
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
            <Icon d={Icons.plus} size={14} color="#05061A" /> New Matter
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? C.gold : C.surface,
                  border: `1px solid ${filter === f ? C.gold : C.border}`,
                  borderRadius: 20,
                  padding: "5px 12px",
                  cursor: "pointer",
                  color: filter === f ? "#05061A" : C.textMuted,
                  fontSize: 12,
                  fontWeight: filter === f ? 600 : 400,
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search matters by title, client, or court…"
              style={{
                width: "100%",
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 7,
                padding: "7px 12px",
                color: C.text,
                fontSize: 12,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ padding: "12px 28px 24px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr", gap: 0, padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
            {["Matter", "Client", "Court", "Next Date", "Status"].map((h) => (
              <div key={h} style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((m, i) => {
            const cfg = STATUS_CFG[m.status] || STATUS_CFG["Active"];
            return (
              <div
                key={m.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr",
                  padding: "12px 16px",
                  alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{m.title}</div>
                  <div style={{ color: C.textDim, fontSize: 11, marginTop: 2 }}>{m.type}</div>
                </div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>{m.client}</div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>{m.court}</div>
                <div style={{ color: m.nextDate === "—" ? C.textDim : C.text, fontSize: 12 }}>{m.nextDate}</div>
                <div>
                  <button
                    onClick={() => cycleStatus(m.id, m.status)}
                    title="Click to cycle status"
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}30`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      color: cfg.color,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {m.status} ⚙️
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
              No matters found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* New Matter Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚖️ Add New Legal Matter</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Matter / Case Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Verma vs. Union of India"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Client Name</label>
                  <input
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Sunita Verma"
                    required
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Court / Forum</label>
                  <input
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    placeholder="Delhi High Court"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Law Category</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  >
                    <option value="Civil">Civil</option>
                    <option value="Criminal">Criminal</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Employment">Employment</option>
                    <option value="IP">IP</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Next Hearing</label>
                  <input
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    placeholder="25 Aug 2025"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MatterStatus)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  >
                    <option value="Active">Active</option>
                    <option value="Hearing">Hearing</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Disposed">Disposed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.textMuted, cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: C.gold, border: "none", borderRadius: 8, padding: "8px 18px", color: "#05061A", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
                >
                  Save Matter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
