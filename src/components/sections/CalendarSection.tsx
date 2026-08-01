"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { CalEvent, CalEventType } from "@/types";

interface CalendarSectionProps {
  events: CalEvent[];
  onAddEvent: (ev: Omit<CalEvent, "id">) => void;
  onDeleteEvent: (id: number) => void;
}

const TYPE_CFG: Record<CalEventType, { color: string; bg: string; emoji: string }> = {
  Hearing: { color: C.gold, bg: C.goldGlow, emoji: "⚖️" },
  Deadline: { color: C.red, bg: C.redSoft, emoji: "⏰" },
  Meeting: { color: C.blue, bg: C.blueSoft, emoji: "🤝" },
  Filing: { color: C.green, bg: C.greenSoft, emoji: "📋" },
};

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function CalendarSection({ events, onAddEvent, onDeleteEvent }: CalendarSectionProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [court, setCourt] = useState("");
  const [date, setDate] = useState("12 Jul 2025");
  const [time, setTime] = useState("10:30 AM");
  const [room, setRoom] = useState("Court Room 1");
  const [type, setType] = useState<CalEventType>("Hearing");

  const eventDates = new Set(events.map((e) => parseInt(e.date.split(" ")[0])));

  const filteredEvents = events.filter((ev) => {
    if (!selectedDay) return true;
    const dayNum = parseInt(ev.date.split(" ")[0]);
    return dayNum === selectedDay;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddEvent({
      title: title.trim(),
      court: court.trim() || "District Court",
      date: date.trim() || "15 Jul 2025",
      time: time.trim() || "11:00 AM",
      room: room.trim() || "Chamber 2",
      type,
    });

    setTitle("");
    setCourt("");
    setShowModal(false);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>📅 Legal Calendar & Cause List</h2>
            <p style={{ color: C.textMuted, fontSize: 13 }}>Court dates, hearings, deadlines, and client meetings</p>
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
            <Icon d={Icons.plus} size={14} color="#05061A" /> Add Event
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 480 }}>
        {/* Mini Calendar Sidebar */}
        <div style={{ width: 300, borderRight: `1px solid ${C.border}`, padding: "20px", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>July 2025</span>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                style={{ background: "none", border: "none", color: C.gold, fontSize: 11, cursor: "pointer" }}
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Day names */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
            {DAYS_SHORT.map((d) => (
              <div key={d} style={{ color: C.textDim, fontSize: 10, fontWeight: 600, textAlign: "center" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {MONTH_DAYS.map((d) => {
              const hasEvent = eventDates.has(d);
              const isSelected = selectedDay === d;
              return (
                <div
                  key={d}
                  onClick={() => setSelectedDay(isSelected ? null : d)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 6,
                    background: isSelected ? C.gold : "none",
                    border: hasEvent && !isSelected ? `1px solid ${C.gold}60` : "1px solid transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    position: "relative",
                  }}
                >
                  <span style={{ color: isSelected ? "#05061A" : C.textMuted, fontSize: 11, fontWeight: isSelected ? 700 : 400 }}>
                    {d}
                  </span>
                  {hasEvent && !isSelected && (
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.gold, position: "absolute", bottom: 3 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(TYPE_CFG).map(([t, cfg]) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: cfg.bg, border: `1px solid ${cfg.color}40` }} />
                <span style={{ color: C.textMuted, fontSize: 12 }}>
                  {cfg.emoji} {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Event List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          <div style={{ color: C.textDim, fontSize: 11, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 14 }}>
            {selectedDay ? `Events for July ${selectedDay}, 2025` : "All Upcoming Events — July 2025"} ({filteredEvents.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredEvents.map((ev) => {
              const cfg = TYPE_CFG[ev.type] || TYPE_CFG["Hearing"];
              return (
                <div
                  key={ev.id}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    borderLeft: `3px solid ${cfg.color}`,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 8,
                      background: cfg.bg,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ color: cfg.color, fontSize: 16 }}>{cfg.emoji}</span>
                    <span style={{ color: cfg.color, fontSize: 9, fontWeight: 700 }}>{ev.type.toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.text, fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>🏛️ {ev.court}</span>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>🕐 {ev.time}</span>
                      <span style={{ color: C.textMuted, fontSize: 12 }}>📍 {ev.room}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, display: "flex", gap: 10, alignItems: "center" }}>
                    <div>
                      <div style={{ color: C.gold, fontSize: 13, fontWeight: 700 }}>{ev.date.split(" ")[0]}</div>
                      <div style={{ color: C.textDim, fontSize: 11 }}>{ev.date.split(" ").slice(1).join(" ")}</div>
                    </div>
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      title="Delete Event"
                      style={{ background: "none", border: "none", color: C.textDim, cursor: "pointer", fontSize: 14 }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredEvents.length === 0 && (
              <div style={{ padding: "40px", textAlign: "center", color: C.textMuted, fontSize: 13 }}>
                No court events scheduled for this selection.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: "24px", width: 440, maxWidth: "90%" }}>
            <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📅 Schedule Court Event</h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Event Title / Case Name</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sharma vs Gupta - Arguments"
                  required
                  style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Court / Venue</label>
                  <input
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    placeholder="Delhi High Court"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Event Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as CalEventType)}
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  >
                    <option value="Hearing">Hearing</option>
                    <option value="Deadline">Deadline</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Filing">Filing</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Date</label>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="15 Jul 2025"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Time</label>
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10:30 AM"
                    style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ color: C.textMuted, fontSize: 12, display: "block", marginBottom: 4 }}>Room / Hall</label>
                  <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Court 4"
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
