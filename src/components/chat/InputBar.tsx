"use client";

import { RefObject, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { C } from "@/constants/colors";
import { Icons } from "@/constants/icons";
import { MODEL_CHIP_SUGGESTIONS } from "@/constants/data";
import { Attachment, AIModel } from "@/types";

interface InputBarProps {
  input: string;
  loading: boolean;
  inputRef: RefObject<HTMLTextAreaElement>;
  attachments: Attachment[];
  isRecording: boolean;
  recordingSeconds: number;
  isWebSearch: boolean;
  selectedModel?: AIModel;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onChip: (text: string) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveAttachment: (id: string) => void;
  onStartVoice: () => void;
  onStopVoice: () => void;
  onToggleWebSearch: () => void;
}

const PLACEHOLDERS: Record<AIModel, { text: string; icon: string; color: string }> = {
  "Nyay Standard": {
    text: "Welcome to Nyay Standard Mode — Ask your practical legal question or draft advice…",
    icon: "⚡",
    color: "#4F8EF7",
  },
  "Nyay Research": {
    text: "Welcome to Nyay Research Mode — Ask for case citations, ratio decidendi & statutory mappings…",
    icon: "🔬",
    color: "#818CF8",
  },
  "Nyay Pro": {
    text: "Welcome to Nyay Pro Judicial Suite — Request a formal High Court bench opinion or court decree…",
    icon: "⚖️",
    color: C.gold,
  },
};

export default function InputBar({
  input,
  loading,
  inputRef,
  attachments,
  isRecording,
  recordingSeconds,
  isWebSearch,
  selectedModel = "Nyay Pro",
  onChange,
  onKeyDown,
  onSend,
  onChip,
  onAddFiles,
  onRemoveAttachment,
  onStartVoice,
  onStopVoice,
  onToggleWebSearch,
}: InputBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cfg = PLACEHOLDERS[selectedModel] || PLACEHOLDERS["Nyay Pro"];
  const suggestions = MODEL_CHIP_SUGGESTIONS[selectedModel] || MODEL_CHIP_SUGGESTIONS["Nyay Pro"];

  const canSend = (input.trim().length > 0 || attachments.length > 0) && !loading;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = "";
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={{ background: C.panel, borderTop: `1px solid ${C.border}`, padding: "14px 20px" }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
        multiple
        style={{ display: "none" }}
      />

      {/* Attachments & Recording Preview Chips */}
      {attachments.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          {attachments.map((att) => (
            <div
              key={att.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.gold}50`,
                borderRadius: 8,
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12,
                color: C.text,
              }}
            >
              {att.type === "image" && att.previewUrl ? (
                <img
                  src={att.previewUrl}
                  alt={att.name}
                  style={{ width: 24, height: 24, borderRadius: 4, objectFit: "cover" }}
                />
              ) : att.type === "audio" ? (
                <Icon d={Icons.mic} size={15} color={C.gold} />
              ) : (
                <Icon d={Icons.docs} size={15} color={C.blue} />
              )}
              <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {att.name}
              </span>
              <button
                onClick={() => onRemoveAttachment(att.id)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.textDim,
                  fontSize: 14,
                  fontWeight: "bold",
                  padding: 0,
                  display: "flex",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice recording banner */}
      {isRecording && (
        <div
          style={{
            background: C.redSoft,
            border: `1px solid ${C.red}40`,
            borderRadius: 8,
            padding: "8px 14px",
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: C.red,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ animation: "pulse 1s infinite", width: 10, height: 10, borderRadius: "50%", background: C.red }} />
            <span>Recording Voice Note… ({formatSeconds(recordingSeconds)})</span>
          </div>
          <button
            onClick={onStopVoice}
            style={{
              background: C.red,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Done Recording
          </button>
        </div>
      )}

      {/* Mode active banner chip */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <span
          style={{
            background: `${cfg.color}15`,
            border: `1px solid ${cfg.color}40`,
            borderRadius: 12,
            padding: "2px 10px",
            color: cfg.color,
            fontSize: 11,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span>{cfg.icon}</span>
          <span>{selectedModel} Engine Active</span>
        </span>
      </div>

      {/* Text box container */}
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.borderLight}`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: `0 0 0 1px ${C.border}`,
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={cfg.text}
          rows={1}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            color: C.text,
            fontSize: 14,
            lineHeight: 1.6,
            padding: "12px 16px 4px",
            resize: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            maxHeight: 120,
            overflowY: "auto",
          }}
          onInput={(e) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
          }}
        />

        {/* Toolbar row */}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 10px 10px", gap: 6 }}>
          {/* Attach file / Image */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Attach file or image"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <Icon d={Icons.attach} size={17} color={attachments.length > 0 ? C.gold : C.textDim} />
          </button>

          {/* Voice Input */}
          <button
            onClick={isRecording ? onStopVoice : onStartVoice}
            title={isRecording ? "Stop recording" : "Voice input"}
            style={{
              background: isRecording ? C.redSoft : "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
            }}
          >
            <Icon d={Icons.mic} size={17} color={isRecording ? C.red : C.textDim} />
          </button>

          {/* Web search toggle */}
          <button
            onClick={onToggleWebSearch}
            title="Toggle Legal Web Search"
            style={{
              background: isWebSearch ? C.goldGlow : "none",
              border: isWebSearch ? `1px solid ${C.gold}40` : "none",
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: isWebSearch ? C.gold : C.textDim,
            }}
          >
            <Icon d={Icons.globe} size={16} color={isWebSearch ? C.gold : C.textDim} />
            <span>Web Search {isWebSearch ? "ON" : ""}</span>
          </button>

          <div style={{ flex: 1 }} />
          <span style={{ color: C.textDim, fontSize: 11, marginRight: 6 }}>↵ Send</span>

          <button
            onClick={onSend}
            disabled={!canSend}
            style={{
              background: canSend ? cfg.color : C.border,
              border: "none",
              borderRadius: 8,
              padding: "7px 14px",
              cursor: canSend ? "pointer" : "not-allowed",
              color: canSend ? (selectedModel === "Nyay Standard" ? "#fff" : "#05061A") : C.textDim,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <Icon d={Icons.send} size={14} color={canSend ? (selectedModel === "Nyay Standard" ? "#fff" : "#05061A") : C.textDim} />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Model specific chip suggestions */}
      <div style={{ display: "flex", gap: 7, marginTop: 10, flexWrap: "wrap" }}>
        {suggestions.map((c) => (
          <button
            key={c}
            onClick={() => onChip(c)}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: "4px 11px",
              cursor: "pointer",
              color: C.textMuted,
              fontSize: 12,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = cfg.color;
              (e.currentTarget as HTMLButtonElement).style.color = cfg.color;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
              (e.currentTarget as HTMLButtonElement).style.color = C.textMuted;
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Footer disclaimer */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ color: C.textDim, fontSize: 11 }}>
          Nyay.ai ({selectedModel}) may make errors. Verify critical legal information with a qualified advocate.
        </span>
      </div>
    </div>
  );
}
