"use client";

import { RefObject } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import { C } from "@/constants/colors";
import { Message as MessageType, AIModel } from "@/types";

interface ChatWindowProps {
  messages:   MessageType[];
  loading:    boolean;
  model:      AIModel;
  bottomRef:  RefObject<HTMLDivElement>;
}

export default function ChatWindow({ messages, loading, model, bottomRef }: ChatWindowProps) {
  return (
    <div style={{
      flex:       1,
      overflowY:  "auto",
      scrollbarWidth: "thin",
      scrollbarColor: `${C.border} transparent`,
    }}>
      <div style={{
        maxWidth: 820, width: "100%",
        margin:   "0 auto",
        padding:  "24px 32px",
        boxSizing:"border-box",
      }}>
        {messages.map(m => (
          <Message key={m.id} msg={m} model={model} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
