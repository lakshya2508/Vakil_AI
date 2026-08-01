"use client";

import { useEffect, useState } from "react";
import { C } from "@/constants/colors";

const CONSENT_KEY = "nyay_privacy_consent_v1";

/**
 * Blocking first-run consent notice. Discloses that user-submitted chat
 * messages, contracts, and documents are sent to a third-party AI processor
 * (Anthropic) for analysis, per DPDP Act / GDPR-style transparency
 * requirements. Must be accepted once per browser before the app is usable.
 */
export default function PrivacyConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = typeof window !== "undefined" && localStorage.getItem(CONSENT_KEY) === "true";
    setVisible(!accepted);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-consent-title"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          maxWidth: 480, width: "100%", background: C.bg ?? "#0f172a",
          border: "1px solid #223047", borderRadius: 16, padding: 28,
          color: "#e5e7eb", boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <h2 id="privacy-consent-title" style={{ marginTop: 0, fontSize: 20 }}>
          Before you continue
        </h2>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#cbd5e1" }}>
          Nyay.ai uses a third-party AI provider (Anthropic&apos;s Claude API) to process
          messages, contracts, and documents you submit. Your text is sent to Anthropic&apos;s
          servers to generate a response and is subject to{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noreferrer" style={{ color: "#5eead4" }}>
            Anthropic&apos;s privacy policy
          </a>.
        </p>
        <ul style={{ fontSize: 13, lineHeight: 1.6, color: "#94a3b8", paddingLeft: 18 }}>
          <li>Do not paste highly sensitive personal data (e.g. financial account numbers, medical records) unless necessary.</li>
          <li>Nyay.ai provides general legal information only and is <strong>not a substitute for professional legal advice</strong>.</li>
          <li>You can request deletion of your account data at any time by contacting support.</li>
        </ul>
        <button
          onClick={accept}
          style={{
            marginTop: 12, width: "100%", padding: "10px 16px",
            borderRadius: 10, border: "none", cursor: "pointer",
            background: "#5eead4", color: "#0b0f1a", fontWeight: 700, fontSize: 14,
          }}
        >
          I understand and accept
        </button>
      </div>
    </div>
  );
}
