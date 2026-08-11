"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, AIModel, ChatTab, Attachment, Client, CalEvent, Invoice, Matter, InvoiceStatus, MatterStatus, ChatSession } from "@/types";
import { CLIENTS, CAL_EVENTS, INVOICES, MATTERS, CHAT_HISTORY } from "@/constants/data";

const MAX_HISTORY_MESSAGES = 30;
const STORAGE_KEY = "nyay_chat_sessions_v1";

const INITIAL_SESSIONS: ChatSession[] = CHAT_HISTORY.map((h, i) => ({
  id: h.id,
  title: h.title,
  date: h.date,
  model: i === 0 ? "Nyay Pro" : i === 1 ? "Nyay Research" : "Nyay Standard",
  messages: [
    {
      id: Date.now() - 1000,
      role: "user",
      content: h.title,
    },
    {
      id: Date.now(),
      role: "assistant",
      content: `I. JUDICIAL BENCH OPINION\n\nRegarding "${h.title}":\n1. Legal Precedent & Analysis: The primary legal framework governing this matter falls under the Bharatiya Nyaya Sanhita, 2023 (BNS) and Constitutional provisions.\n2. Key Findings: Proceedings must adhere strictly to statutory limitation periods and natural justice principles.\n\nII. ADVOCATE ACTIONABLE RECOMMENDATIONS\n- Obtain certified copies of all judicial orders.\n- Serve statutory notice within 30 days of cause of action.`,
      model: i === 0 ? "Nyay Pro" : i === 1 ? "Nyay Research" : "Nyay Standard",
    },
  ],
}));

export function useChat() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChatState] = useState<number>(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
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

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setChatSessions(parsed);
          setActiveChatState(parsed[0].id);
          setMessages(parsed[0].messages || []);
          setShowWelcome(parsed[0].messages.length === 0);
          if (parsed[0].model) setSelectedModel(parsed[0].model);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load chat history from localStorage", e);
    }
    // Fallback initial sessions
    setChatSessions(INITIAL_SESSIONS);
    setActiveChatState(INITIAL_SESSIONS[0].id);
    setMessages(INITIAL_SESSIONS[0].messages);
    setShowWelcome(false);
  }, []);

  // Save chat sessions to localStorage on changes
  const saveSessionsToStorage = useCallback((sessions: ChatSession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn("Failed to save chat sessions to localStorage", e);
    }
  }, []);

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

  // Select a chat session from recent history
  const selectChat = useCallback((id: number) => {
    setActiveChatState(id);
    setChatSessions((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) {
        setMessages(target.messages || []);
        setShowWelcome((target.messages || []).length === 0);
        if (target.model) setSelectedModel(target.model);
      }
      return prev;
    });
    setActiveNav("chat");
    setActiveTab("legal-chat");
  }, []);

  // Start a brand new chat session
  const startNewChat = useCallback(() => {
    const newId = Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: "New Legal Inquiry",
      date: "Just now",
      messages: [],
      model: selectedModel,
    };

    setChatSessions((prev) => {
      const updated = [newSession, ...prev];
      saveSessionsToStorage(updated);
      return updated;
    });

    setActiveChatState(newId);
    setMessages([]);
    setShowWelcome(true);
    setInput("");
    setAttachments([]);
    setActiveTab("legal-chat");
  }, [selectedModel, saveSessionsToStorage]);

  // Delete a chat session
  const deleteChatSession = useCallback((id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setChatSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveSessionsToStorage(updated);
      if (updated.length > 0) {
        setActiveChatState(updated[0].id);
        setMessages(updated[0].messages || []);
        setShowWelcome((updated[0].messages || []).length === 0);
      } else {
        const fresh: ChatSession = { id: Date.now(), title: "New Legal Inquiry", date: "Just now", messages: [], model: "Nyay Pro" };
        saveSessionsToStorage([fresh]);
        setActiveChatState(fresh.id);
        setMessages([]);
        setShowWelcome(true);
        return [fresh];
      }
      return updated;
    });
  }, [saveSessionsToStorage]);

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

  // Send message handler with automatic persistent session updates
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

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, userMsg];

        // Sync with active session in chatSessions state & localStorage
        setChatSessions((prevSessions) => {
          const sessionIndex = prevSessions.findIndex((s) => s.id === activeChat);
          let newSessions: ChatSession[];

          if (sessionIndex >= 0) {
            const currentSession = prevSessions[sessionIndex];
            const title =
              currentSession.title === "New Legal Inquiry" || currentSession.messages.length === 0
                ? query.substring(0, 42) + (query.length > 42 ? "..." : "")
                : currentSession.title;

            const updatedSession: ChatSession = {
              ...currentSession,
              title: title || "Legal Inquiry",
              messages: updatedMessages,
              model: selectedModel,
            };

            newSessions = [
              updatedSession,
              ...prevSessions.filter((_, idx) => idx !== sessionIndex),
            ];
          } else {
            const newSession: ChatSession = {
              id: activeChat,
              title: query.substring(0, 42) + (query.length > 42 ? "..." : ""),
              date: "Just now",
              messages: updatedMessages,
              model: selectedModel,
            };
            newSessions = [newSession, ...prevSessions];
          }

          saveSessionsToStorage(newSessions);
          return newSessions;
        });

        return updatedMessages;
      });

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

        const assistantMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.content,
          model: selectedModel,
        };

        setMessages((prevMessages) => {
          const finalMessages = [...prevMessages, assistantMsg];

          // Persist assistant response into chat session
          setChatSessions((prevSessions) => {
            const sessionIndex = prevSessions.findIndex((s) => s.id === activeChat);
            if (sessionIndex >= 0) {
              const updated = [...prevSessions];
              updated[sessionIndex] = {
                ...updated[sessionIndex],
                messages: finalMessages,
              };
              saveSessionsToStorage(updated);
              return updated;
            }
            return prevSessions;
          });

          return finalMessages;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        const errorMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: `⚠️ Error: ${message}. Please try again.`,
          model: selectedModel,
        };
        setMessages((prevMessages) => [...prevMessages, errorMsg]);
      } finally {
        setLoading(false);
      }
    },
    [input, attachments, loading, messages, isWebSearch, selectedModel, activeChat, saveSessionsToStorage]
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
    chatSessions,
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

    // Setters & Actions
    setInput,
    selectChat,
    setActiveNav,
    setActiveTab,
    setShowWelcome,
    setSidebarOpen,
    setModelOpen,
    setSelectedModel: changeModel,
    sendMessage,
    startNewChat,
    deleteChatSession,
    handleKeyDown,
  };
}
