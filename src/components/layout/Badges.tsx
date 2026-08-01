import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { COMPLIANCE_BADGES } from "@/constants/data";

export default function Badges() {
  return (
    <footer style={{
      display:        "flex",
      gap:            10,
      padding:        "8px 20px",
      background:     C.bg,
      borderTop:      `1px solid ${C.border}`,
      justifyContent: "center",
      flexWrap:       "wrap",
    }}>
      {COMPLIANCE_BADGES.map(b => (
        <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, fontSize: 11 }}>
          <Icon d={b.icon} size={12} color={b.color} />
          <span>{b.label}</span>
        </div>
      ))}
    </footer>
  );
}
