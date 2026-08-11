// ── Attachment ─────────────────────────────────────────
export interface Attachment {
  id:          string;
  type:        "image" | "audio" | "file";
  name:        string;
  mimeType:    string;
  data:        string; // base64 representation
  previewUrl?: string;
}

// ── Message ────────────────────────────────────────────
export interface Message {
  id:           number;
  role:         "user" | "assistant";
  content:      string;
  attachments?: Attachment[];
  model?:       AIModel;
}

// ── Chat history ───────────────────────────────────────
export interface ChatHistory {
  id:      number;
  title:   string;
  date:    string;
  active?: boolean;
}

export interface ChatSession {
  id:       number;
  title:    string;
  date:     string;
  messages: Message[];
  model:    AIModel;
}

// ── Quick prompt ───────────────────────────────────────
export interface QuickPrompt {
  icon:  string;
  color: string;
  bg:    string;
  title: string;
  desc:  string;
}

// ── Nav ────────────────────────────────────────────────
export interface NavItem {
  icon:  string;
  label: string;
  id:    string;
}

// ── Chat sub-tabs ──────────────────────────────────────
export type ChatTab =
  | "legal-chat"
  | "law-library"
  | "documents"
  | "case-research"
  | "compliance";

// ── AI Model ───────────────────────────────────────────
export type AIModel = "Nyay Pro" | "Nyay Standard" | "Nyay Research";

// ── Document Template ──────────────────────────────────
export interface DocTemplate {
  id:       string;
  icon:     string;
  category: string;
  title:    string;
  desc:     string;
  fields:   string[];
}

// ── Matter ─────────────────────────────────────────────
export type MatterStatus = "Active" | "Hearing" | "Disposed" | "On Hold";
export interface Matter {
  id:       number;
  title:    string;
  client:   string;
  court:    string;
  nextDate: string;
  status:   MatterStatus;
  type:     string;
}

// ── Client ─────────────────────────────────────────────
export interface Client {
  id:       number;
  name:     string;
  initials: string;
  phone:    string;
  email:    string;
  matters:  number;
  since:    string;
  color:    string;
}

// ── Calendar Event ─────────────────────────────────────
export type CalEventType = "Hearing" | "Deadline" | "Meeting" | "Filing";
export interface CalEvent {
  id:    number;
  title: string;
  court: string;
  date:  string;
  time:  string;
  room:  string;
  type:  CalEventType;
}

// ── Invoice ────────────────────────────────────────────
export type InvoiceStatus = "Paid" | "Pending" | "Overdue";
export interface Invoice {
  id:      number;
  client:  string;
  matter:  string;
  amount:  number;
  date:    string;
  due:     string;
  status:  InvoiceStatus;
}

// ── Law Act ────────────────────────────────────────────
export interface LawAct {
  id:       string;
  title:    string;
  year:     string;
  category: string;
  sections: number;
  summary:  string;
  tags:     string[];
}

// ── Compliance Item ────────────────────────────────────
export type ComplianceLevel = "Compliant" | "Review" | "Action Required";
export interface ComplianceItem {
  id:       number;
  law:      string;
  area:     string;
  level:    ComplianceLevel;
  due:      string;
  desc:     string;
}

// ── API ────────────────────────────────────────────────
export interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string; attachments?: Attachment[] }[];
  model?:   AIModel;
  webSearch?: boolean;
}
export interface ChatResponse {
  content: string;
  error?:  string;
}

