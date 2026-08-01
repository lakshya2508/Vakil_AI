"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, AIModel, ChatTab, Attachment, Client, CalEvent, Invoice, Matter, InvoiceStatus, MatterStatus } from "@/types";
import { CLIENTS, CAL_EVENTS, INVOICES, MATTERS } from "@/constants/data";

const MAX_HISTORY_MESSAGES = 30;

export function useChat() {
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeChat, setActiveChat] = useState<number>(1);
  const [activeNav, setActiveNav] = useState("chat");
  const [activeTab, setActiveTab] = useState<ChatTab>("legal-chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>("Nyay Pro");

  // Multimodal & Tool states
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isWebSearch, setIsWebSearch] = useState(false);

  // Dynamic Directory Data states
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [events, setEvents] = useState<CalEvent[]>(CAL_EVENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);
  const [matters, setMatters] = useState<Matter[]>(MATTERS);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, attachments]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setShowWelcome(true);
    setInput("");
    setAttachments([]);
    setActiveTab("legal-chat");
  }, []);

  // Attachment handling
  const addFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        let type: "image" | "audio" | "file" = "file";
        if (file.type.startsWith("image/")) type = "image";
        else if (file.type.startsWith("audio/")) type = "audio";

        const newAtt: Attachment = {
          id: "att_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          type,
          name: file.name,
          mimeType: file.type || (type === "image" ? "image/jpeg" : type === "audio" ? "audio/mp3" : "text/plain"),
          data: base64,
          previewUrl: type === "image" ? base64 : undefined,
        };
        setAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  // Voice recording functions
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const newAtt: Attachment = {
            id: "rec_" + Date.now(),
            type: "audio",
            name: `Voice_Recording_${new Date().toLocaleTimeString().replace(/:/g, "-")}.webm`,
            mimeType: "audio/webm",
            data: base64,
          };
          setAttachments((prev) => [...prev, newAtt]);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone recording error:", err);
      alert("Microphone permission required for voice recording.");
    }
  }, []);

  const stopVoiceRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const toggleWebSearch = useCallback(() => {
    setIsWebSearch((prev) => !prev);
  }, []);

  // Send message handler with multimodal attachments
  const sendMessage = useCallback(
    async (text?: string, overrideAttachments?: Attachment[]) => {
      const query = (text ?? input).trim();
      const currentAtts = overrideAttachments ?? attachments;

      if ((!query && currentAtts.length === 0) || loading) return;

      setInput("");
      setAttachments([]);
      setShowWelcome(false);
      setActiveTab("legal-chat");

      const userMsg: Message = {
        id: Date.now(),
        role: "user",
        content: query || (currentAtts.length ? "Analyze attached media/file" : ""),
        attachments: currentAtts.length > 0 ? currentAtts : undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const fullHistory = [...messages, userMsg];
        const trimmed =
          fullHistory.length > MAX_HISTORY_MESSAGES
            ? fullHistory.slice(fullHistory.length - MAX_HISTORY_MESSAGES)
            : fullHistory;

        const historyPayload = trimmed.map((m) => ({
          role: m.role,
          content: m.content,
          attachments: m.attachments,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: historyPayload,
            webSearch: isWebSearch,
            model: selectedModel,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Request failed");

        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "assistant", content: data.content, model: selectedModel },
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "assistant", content: `⚠️ Error: ${message}. Please try again.`, model: selectedModel },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, attachments, loading, messages, isWebSearch, selectedModel]
  );

  const changeModel = useCallback((m: AIModel) => {
    setSelectedModel(m);
    setActiveTab("legal-chat");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Dynamic CRUD state functions for Client, Calendar, Invoice, Matter
  const addClient = useCallback((newClient: Omit<Client, "id">) => {
    setClients((prev) => [{ ...newClient, id: Date.now() }, ...prev]);
  }, []);

  const deleteClient = useCallback((id: number) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addEvent = useCallback((newEvent: Omit<CalEvent, "id">) => {
    setEvents((prev) => [{ ...newEvent, id: Date.now() }, ...prev]);
  }, []);

  const deleteEvent = useCallback((id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addInvoice = useCallback((newInvoice: Omit<Invoice, "id">) => {
    setInvoices((prev) => [{ ...newInvoice, id: Date.now() }, ...prev]);
  }, []);

  const updateInvoiceStatus = useCallback((id: number, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  }, []);

  const addMatter = useCallback((newMatter: Omit<Matter, "id">) => {
    setMatters((prev) => [{ ...newMatter, id: Date.now() }, ...prev]);
  }, []);

  const updateMatterStatus = useCallback((id: number, status: MatterStatus) => {
    setMatters((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }, []);

  return {
    messages,
    input,
    loading,
    showWelcome,
    activeChat,
    activeNav,
    activeTab,
    sidebarOpen,
    modelOpen,
    selectedModel,
    bottomRef,
    inputRef,

    // Multimodal & Tools
    attachments,
    isRecording,
    recordingSeconds,
    isWebSearch,
    addFiles,
    removeAttachment,
    clearAttachments,
    startVoiceRecording,
    stopVoiceRecording,
    toggleWebSearch,

    // Directory State & CRUD
    clients,
    events,
    invoices,
    matters,
    addClient,
    deleteClient,
    addEvent,
    deleteEvent,
    addInvoice,
    updateInvoiceStatus,
    addMatter,
    updateMatterStatus,

    // Setters
    setInput,
    setActiveChat,
    setActiveNav,
    setActiveTab,
    setShowWelcome,
    setSidebarOpen,
    setModelOpen,
    setSelectedModel: changeModel,
    sendMessage,
    startNewChat,
    handleKeyDown,
  };
}
