"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { Invoice, InvoiceStatus } from "@/types";

interface BillingSectionProps {
  invoices: Invoice[];
  onAddInvoice: (inv: Omit<Invoice, "id">) => void;
  onUpdateStatus: (id: number, status: InvoiceStatus) => void;
}

const STATUS_CFG: Record<InvoiceStatus, { color: string; bg: string }> = {
  Paid: { color: C.green, bg: C.greenSoft },
  Pending: { color: C.amber, bg: C.amberSoft },
  Overdue: { color: C.red, bg: C.redSoft },
};

const FILTERS: (InvoiceStatus | "All")[] = ["All", "Paid", "Pending", "Overdue"];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function BillingSection({ invoices, onAddInvoice, onUpdateStatus }: BillingSectionProps) {
  const [filter, setFilter] = useState<InvoiceStatus | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState("");
  const [matter, setMatter] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("01 Aug 2025");
  const [due, setDue] = useState("31 Aug 2025");
  const [status, setStatus] = useState<InvoiceStatus>("Pending");

  const totalRevenue = invoices.filter((i) => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "Pending").reduce((a, i) => a + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.amount, 0);
  const filtered = invoices.filter((i) => filter === "All" || i.status === filter);

  const STATS = [
    { label: "Total Collected", value: fmt(totalRevenue), color: C.green },
    { label: "Pending", value: fmt(totalPending), color: C.amber },
    { label: "Overdue", value: fmt(totalOverdue), color: C.red },
    { label: "Total Invoices", value: `${invoices.length}`, color: C.gold },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !amount) return;

    onAddInvoice({
      client: client.trim(),
      matter: matter.trim() || "Legal Services",
      amount: parseFloat(amount) || 0,
      date: date.trim() || "01 Aug 2025",
      due: due.trim() || "31 Aug 2025",
      status,
    });

    setClient("");
    setMatter("");
    setAmount("");
    setShowModal(false);
  };

  const cycleStatus = (id: number, current: InvoiceStatus) => {
    const next: InvoiceStatus = current === "Pending" ? "Paid" : current === "Paid" ? "Overdue" : "Pending";
    onUpdateStatus(id, next);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>💳 Billing & Invoices</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>Track retainer fees, court expenses, and client billing</p>
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
            <Icon d={Icons.plus} size={14} color="#05061A" /> New Invoice
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 16 }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ color: s.color, fontSize: 18, fontWeight: 700 }}>{s.value}</div>
              <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? C.gold : C.surface,
                border: `1px solid ${filter === f ? C.gold : C.border}`,
                borderRadius: 20,
                padding: "5px 14px",
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
      </div>

      {/* Invoice table */}
      <div style={{ padding: "12px 28px 24px" }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}>
            {["Invoice #", "Client / Matter", "Amount", "Issued", "Due Date", "Status"].map((h) => (
              <div key={h} style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {filtered.map((inv, i) => {
            const cfg = STATUS_CFG[inv.status];
            return (
              <div
                key={inv.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr 1fr",
                  padding: "12px 16px",
                  alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : "none",
                }}
              >
                <div style={{ color: C.gold, fontSize: 12, fontFamily: "monospace" }}>INV-{String(inv.id).padStart(4, "0")}</div>
                <div>
                  <div style={{ color: C.text, fontSize: 12, fontWeight: 500 }}>{inv.client}</div>
                  <div style={{ color: C.textDim, fontSize: 11, marginTop: 1 }}>{inv.matter}</div>
                </div>
                <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{fmt(inv.amount)}</div>
                <div style={{ color: C.textMuted, fontSize: 12 }}>{inv.date}</div>
                <div style={{ color: inv.status === "Overdue" ? C.red : C.textMuted, fontSize: 12 }}>{inv.due}</div>
                <div>
                  <button
                    onClick={() => cycleStatus(inv.id, inv.status)}
                    title="Click to cycle status (Pending -> Paid -> Overdue)"
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}40`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      color: cfg.color,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {inv.status} ⚙️
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
              No invoices match the selected status filter.
            </div>
          )}
        </div>
      </div>

      {/* New Invoice Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🧾 Generate New Invoice</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Client Name</label>
                <input
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. TechCorp Pvt Ltd"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Matter / Legal Brief</label>
                <input
                  value={matter}
                  onChange={(e) => setMatter(e.target.value)}
                  placeholder="e.g. High Court Appeal Representation"
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="75000"
                    required
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Issued Date</label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="01 Aug 2025"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Due Date</label>
                  <input
                    value={due}
                    onChange={(e) => setDue(e.target.value)}
                    placeholder="31 Aug 2025"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
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
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
