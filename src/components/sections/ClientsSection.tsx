"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { Client } from "@/types";

interface ClientsSectionProps {
  clients: Client[];
  onAddClient: (c: Omit<Client, "id">) => void;
  onDeleteClient: (id: number) => void;
}

const COLORS = ["#6C63FF", "#4F8EF7", "#22C55E", "#F59E0B", "#F04F43", "#818CF8"];

export default function ClientsSection({ clients, onAddClient, onDeleteClient }: ClientsSectionProps) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mattersCount, setMattersCount] = useState("1");
  const [viewingClient, setViewingClient] = useState<Client | null>(null);

  const filtered = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parts = name.trim().split(" ");
    const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    onAddClient({
      name: name.trim(),
      initials,
      phone: phone.trim() || "+91 98000 00000",
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      matters: parseInt(mattersCount) || 1,
      since: "Today",
      color,
    });

    setName("");
    setPhone("");
    setEmail("");
    setMattersCount("1");
    setShowModal(false);
  };

  const activeMattersTotal = clients.reduce((acc, c) => acc + c.matters, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>👥 Clients Directory</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>Manage client profiles, contact info, and active representation</p>
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
            <Icon d={Icons.plus} size={14} color="#05061A" /> Add Client
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 16 }}>
          {[
            { label: "Total Clients", value: `${clients.length}`, color: C.gold },
            { label: "Active Matters", value: `${activeMattersTotal}`, color: C.green },
            { label: "New This Month", value: `${clients.filter(c => c.since === "Today" || c.since.includes("2025") || c.since.includes("2024")).length}`, color: C.blue },
          ].map((s) => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
              <div style={{ color: s.color, fontSize: 22, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginTop: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone number…"
            style={{
              width: "100%",
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "9px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Client cards */}
      <div style={{ padding: "16px 28px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 12 }}>
        {filtered.map((client) => (
          <div
            key={client.id}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: "18px",
              position: "relative",
              transition: "all 0.2s",
            }}
          >
            {/* Delete button */}
            <button
              onClick={() => onDeleteClient(client.id)}
              title="Delete client"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                background: "none",
                border: "none",
                color: C.textDim,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✕
            </button>

            {/* Avatar + name */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: `${client.color}22`,
                  border: `2px solid ${client.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: client.color,
                  fontSize: 15,
                  fontWeight: 700,
                }}
              >
                {client.initials}
              </div>
              <div>
                <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{client.name}</div>
                <div style={{ color: C.textDim, fontSize: 11 }}>Client since {client.since}</div>
              </div>
            </div>

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { icon: Icons.billing, val: client.phone },
                { icon: Icons.docs, val: client.email },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon d={row.icon} size={13} color={C.textDim} />
                  <span style={{ color: C.textMuted, fontSize: 12 }}>{row.val}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: C.textMuted, fontSize: 12 }}>
                <strong style={{ color: client.color }}>{client.matters}</strong> active matter{client.matters !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setViewingClient(client)}
                style={{
                  background: "none",
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "4px 10px",
                  cursor: "pointer",
                  color: C.textMuted,
                  fontSize: 11,
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 420, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>➕ Add New Client</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98100 99999"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@email.com"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Active Matters</label>
                <input
                  type="number"
                  min="0"
                  value={mattersCount}
                  onChange={(e) => setMattersCount(e.target.value)}
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewingClient && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", background: `${viewingClient.color}22`, border: `2px solid ${viewingClient.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: viewingClient.color, fontWeight: 700, fontSize: 18 }}>
                {viewingClient.initials}
              </div>
              <div>
                <h3 style={{ color: C.text, fontSize: 17, fontWeight: 700, margin: 0 }}>{viewingClient.name}</h3>
                <span style={{ color: C.textDim, fontSize: 12 }}>Client since {viewingClient.since}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: C.textMuted, background: C.surface, padding: 14, borderRadius: 8, marginBottom: 16 }}>
              <div>📞 <strong>Phone:</strong> {viewingClient.phone}</div>
              <div>✉️ <strong>Email:</strong> {viewingClient.email}</div>
              <div>⚖️ <strong>Active Matters:</strong> {viewingClient.matters} case(s)</div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setViewingClient(null)} style={{ background: C.gold, border: "none", borderRadius: 8, padding: "8px 18px", color: "#05061A", fontWeight: 600, cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
