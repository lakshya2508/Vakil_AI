import { C } from "@/constants/colors";

export default function TypingIndicator() {
  return (
    <div style={{ marginBottom: 20 }}>
      {/* AI header */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800, color: "#fff",
        }}>न्</div>
        <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Nyay.ai</span>
        <span style={{ color: C.textDim, fontSize: 11 }}>Thinking…</span>
      </div>

      {/* Bouncing dots */}
      <div style={{
        background:   C.surface,
        border:       `1px solid ${C.border}`,
        borderRadius: 12,
        padding:      "14px 18px",
        display:      "inline-flex",
        alignItems:   "center",
        gap:          5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width:            7,
            height:           7,
            borderRadius:     "50%",
            background:       C.gold,
            opacity:          0.8,
            animation:        "nyay-bounce 1.2s ease-in-out infinite",
            animationDelay:   `${i * 0.15}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes nyay-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
