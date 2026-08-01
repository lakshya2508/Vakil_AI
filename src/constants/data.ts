import { NavItem, QuickPrompt, ChatHistory, AIModel, DocTemplate,
         Matter, Client, CalEvent, Invoice, LawAct, ComplianceItem } from "@/types";
import { Icons } from "./icons";
import { C }     from "./colors";

// ── Nav ────────────────────────────────────────────────
export const NAV_ITEMS: NavItem[] = [
  { icon: Icons.chat,     label: "Chat",      id: "chat"     },
  { icon: Icons.docs,     label: "Documents", id: "docs"     },
  { icon: Icons.scale,    label: "Matters",   id: "matters"  },
  { icon: Icons.users,    label: "Clients",   id: "clients"  },
  { icon: Icons.calendar, label: "Calendar",  id: "calendar" },
  { icon: Icons.billing,  label: "Billing",   id: "billing"  },
];

// ── Models ─────────────────────────────────────────────
export const AI_MODELS: AIModel[] = ["Nyay Pro", "Nyay Standard", "Nyay Research"];

// ── Model Specific Quick Prompts ───────────────────────
export const MODEL_QUICK_PROMPTS: Record<AIModel, QuickPrompt[]> = {
  "Nyay Standard": [
    { icon: Icons.docs,    color: C.blue,  bg: C.blueSoft,  title: "Draft Legal Notice (Section 138 NI Act)", desc: "Quick statutory notice for cheque dishonour & payment demand" },
    { icon: Icons.scale,   color: C.gold,  bg: C.goldGlow,  title: "Bail Procedure under BNSS 2023",          desc: "Step-by-step advocate checklist for bailable & non-bailable offences" },
    { icon: Icons.warning, color: C.amber, bg: C.amberSoft, title: "Property Dispute Legal Advisory",        desc: "Title clearance, injunction remedies, and client guidance" },
    { icon: Icons.shield,  color: C.green, bg: C.greenSoft, title: "NDA & Vendor Contract Review",            desc: "Red-flag non-compete, liability, and breach clauses" },
  ],
  "Nyay Research": [
    { icon: Icons.search,  color: C.indigo,bg: C.indigoSoft,title: "Ratio Decidendi: Maneka Gandhi Case",    desc: "Supreme Court AIR 1978 SC 597 precedent & Article 21 scope" },
    { icon: Icons.scale,   color: C.blue,  bg: C.blueSoft,  title: "IPC Sec 378 vs BNS Sec 303 Comparison",   desc: "Statutory mapping table of theft provisions and community service" },
    { icon: Icons.docs,    color: C.gold,  bg: C.goldGlow,  title: "Section 528 BNSS Quashing Precedents",    desc: "Landmark High Court decisions on inherent powers (CrPC 482)" },
    { icon: Icons.warning, color: C.amber, bg: C.amberSoft, title: "Electronic Evidence: Sec 63 BSA",         desc: "Certificate requirement vs Evidence Act Section 65B case law" },
  ],
  "Nyay Pro": [
    { icon: Icons.scale,   color: C.gold,  bg: C.goldGlow,  title: "High Court Bench Opinion: Data Privacy",  desc: "DPDP Act 2023 vs Article 21 Fundamental Right synthesis" },
    { icon: Icons.docs,    color: C.blue,  bg: C.blueSoft,  title: "Petitioner vs Respondent Arguments",      desc: "Dual-party trial strategy & cross-examination memorandum" },
    { icon: Icons.warning, color: C.amber, bg: C.amberSoft, title: "Retrospective Criminality Analysis",      desc: "Constitutional validity check under Article 20(1) for BNS offences" },
    { icon: Icons.shield,  color: C.green, bg: C.greenSoft, title: "Supreme Court Corporate Fraud Decree",    desc: "Directorial liability & vicarious criminal responsibility" },
  ],
};

export const QUICK_PROMPTS = MODEL_QUICK_PROMPTS["Nyay Pro"];

export const MODEL_CHIP_SUGGESTIONS: Record<AIModel, string[]> = {
  "Nyay Standard": ["Section 138 Notice", "BNSS Bail Steps", "Property Dispute", "Contract Review"],
  "Nyay Research": ["IPC vs BNS Table", "Maneka Gandhi Case", "BNSS Sec 528 Quashing", "BSA Sec 63 Electronic Evidence"],
  "Nyay Pro": ["Bench Opinion: Privacy", "Petitioner vs Respondent", "Article 20(1) Validity", "Corporate Fraud Decree"],
};

export const CHIP_SUGGESTIONS = MODEL_CHIP_SUGGESTIONS["Nyay Pro"];

// ── Indian Acts ────────────────────────────────────────
export const INDIAN_ACTS: string[] = [
  "Constitution of India", "IPC 1860", "CrPC", "CPC 1908",
  "Companies Act 2013", "DPDP Act 2023", "IT Act 2000",
  "Transfer of Property Act", "Contract Act 1872",
  "MSME Act", "Arbitration Act", "POCSO Act",
];

// ── Chat history ───────────────────────────────────────
export const CHAT_HISTORY: ChatHistory[] = [
  { id: 1, title: "Property dispute under Transfer of Property Act",        date: "Today",     active: true },
  { id: 2, title: "Section 138 NI Act — cheque bounce case strategy",       date: "Today"                  },
  { id: 3, title: "Employment termination notice period validity",           date: "Yesterday"              },
  { id: 4, title: "FIR quashing petition under Section 482 CrPC",           date: "Yesterday"              },
  { id: 5, title: "MSME arbitration clause enforceability",                  date: "Monday"                 },
  { id: 6, title: "Trademark infringement — passing off action",             date: "Monday"                 },
  { id: 7, title: "Bail application draft — NDPS Act",                      date: "Last week"              },
];

// ── Compliance badges ──────────────────────────────────
export const COMPLIANCE_BADGES = [
  { icon: Icons.shield, label: "DPDP Act 2023 Compliant", color: C.green },
  { icon: Icons.shield, label: "ISO 27001",                color: C.blue  },
  { icon: Icons.shield, label: "Data Encrypted",           color: C.gold  },
  { icon: Icons.shield, label: "Indian Jurisdiction",      color: C.amber },
];

// ── Document templates ─────────────────────────────────
export const DOC_TEMPLATES: DocTemplate[] = [
  { id: "nda",    icon: Icons.docs,    category: "Agreements", title: "Non-Disclosure Agreement",    desc: "Mutual or one-way NDA for business confidentiality",    fields: ["Party A", "Party B", "Duration", "Jurisdiction"] },
  { id: "emp",    icon: Icons.users,   category: "Employment", title: "Employment Agreement",         desc: "Comprehensive offer letter and employment contract",    fields: ["Employer", "Employee", "Designation", "Salary", "Start Date"] },
  { id: "mou",    icon: Icons.scale,   category: "Agreements", title: "Memorandum of Understanding", desc: "MOU between two or more parties for collaboration",     fields: ["Party A", "Party B", "Purpose", "Duration"] },
  { id: "rent",   icon: Icons.book,    category: "Property",   title: "Rent Agreement",              desc: "Residential or commercial lease deed",                  fields: ["Landlord", "Tenant", "Property Address", "Rent", "Tenure"] },
  { id: "sale",   icon: Icons.zap,     category: "Property",   title: "Sale Deed",                   desc: "Property transfer deed under Transfer of Property Act", fields: ["Seller", "Buyer", "Property Details", "Consideration"] },
  { id: "poa",    icon: Icons.shield,  category: "Legal",      title: "Power of Attorney",           desc: "General or special power of attorney document",         fields: ["Principal", "Agent", "Scope", "Duration"] },
  { id: "bail",   icon: Icons.scale,   category: "Litigation", title: "Bail Application",            desc: "Anticipatory or regular bail application draft",        fields: ["Accused", "FIR No.", "Section", "Court", "Grounds"] },
  { id: "legal",  icon: Icons.docs,    category: "Litigation", title: "Legal Notice",                desc: "Formal legal notice under applicable law",              fields: ["Sender", "Recipient", "Subject", "Demand", "Deadline"] },
];

export const DOC_CATEGORIES = ["All", "Agreements", "Employment", "Property", "Litigation", "Legal"];

// ── Matters ────────────────────────────────────────────
export const MATTERS: Matter[] = [
  { id: 1, title: "Sharma vs. Gupta Property Dispute",     client: "Rajesh Sharma",   court: "Delhi HC",         nextDate: "12 Jul 2025", status: "Hearing",  type: "Civil"          },
  { id: 2, title: "State vs. Mehta — Section 138 NI Act",  client: "Priya Mehta",     court: "MM Court, Saket",  nextDate: "18 Jul 2025", status: "Active",   type: "Criminal"       },
  { id: 3, title: "TechCorp Employment Termination",        client: "TechCorp Pvt Ltd",court: "Labour Court",     nextDate: "22 Jul 2025", status: "Active",   type: "Employment"     },
  { id: 4, title: "Kapoor NDA Breach",                     client: "Anita Kapoor",    court: "Delhi HC",         nextDate: "—",           status: "On Hold",  type: "Commercial"     },
  { id: 5, title: "Singh Bail Application — NDPS",         client: "Ravi Singh",      court: "Sessions Court",   nextDate: "09 Jul 2025", status: "Hearing",  type: "Criminal"       },
  { id: 6, title: "Kumar Trademark Infringement",          client: "Kumar Enterprises",court: "IP Tribunal",     nextDate: "30 Jul 2025", status: "Active",   type: "IP"             },
  { id: 7, title: "Verma Divorce Petition",                client: "Sunita Verma",    court: "Family Court",     nextDate: "—",           status: "Disposed", type: "Family"         },
];

// ── Clients ────────────────────────────────────────────
export const CLIENTS: Client[] = [
  { id: 1, name: "Rajesh Sharma",     initials: "RS", phone: "+91 98100 11111", email: "r.sharma@email.com",    matters: 3, since: "Jan 2023", color: "#6C63FF" },
  { id: 2, name: "Priya Mehta",       initials: "PM", phone: "+91 98200 22222", email: "priya.m@email.com",     matters: 1, since: "Mar 2024", color: "#4F8EF7" },
  { id: 3, name: "TechCorp Pvt Ltd",  initials: "TC", phone: "+91 11 4567 8900", email: "legal@techcorp.in",    matters: 4, since: "Jun 2022", color: "#22C55E" },
  { id: 4, name: "Anita Kapoor",      initials: "AK", phone: "+91 99300 33333", email: "anita.k@email.com",     matters: 2, since: "Nov 2023", color: "#F59E0B" },
  { id: 5, name: "Ravi Singh",        initials: "RS", phone: "+91 99400 44444", email: "ravi.s@email.com",      matters: 1, since: "May 2024", color: "#F04F43" },
  { id: 6, name: "Kumar Enterprises", initials: "KE", phone: "+91 11 9876 5432", email: "legal@kumarent.co.in", matters: 2, since: "Feb 2023", color: "#818CF8" },
];

// ── Calendar events ────────────────────────────────────
export const CAL_EVENTS: CalEvent[] = [
  { id: 1, title: "Sharma vs. Gupta — Hearing",    court: "Delhi HC",        date: "12 Jul 2025", time: "10:30 AM", room: "Court Room 5",  type: "Hearing"  },
  { id: 2, title: "Singh Bail — Arguments",         court: "Sessions Court",  date: "09 Jul 2025", time: "11:00 AM", room: "Court Room 2",  type: "Hearing"  },
  { id: 3, title: "TechCorp — Labour Court Date",   court: "Labour Court",    date: "22 Jul 2025", time: "02:00 PM", room: "Court Room 8",  type: "Hearing"  },
  { id: 4, title: "Kumar Trademark — IP Tribunal",  court: "IP Tribunal",     date: "30 Jul 2025", time: "03:00 PM", room: "Tribunal Hall", type: "Hearing"  },
  { id: 5, title: "NI Act Brief Filing Deadline",   court: "MM Court, Saket", date: "15 Jul 2025", time: "05:00 PM", room: "Registry",      type: "Deadline" },
  { id: 6, title: "Client Meeting — Anita Kapoor",  court: "Office",          date: "08 Jul 2025", time: "04:00 PM", room: "—",             type: "Meeting"  },
];

// ── Invoices ───────────────────────────────────────────
export const INVOICES: Invoice[] = [
  { id: 1, client: "TechCorp Pvt Ltd",  matter: "Employment Termination", amount: 85000,  date: "01 Jun 2025", due: "30 Jun 2025", status: "Paid"    },
  { id: 2, client: "Rajesh Sharma",     matter: "Property Dispute",       amount: 45000,  date: "15 Jun 2025", due: "15 Jul 2025", status: "Pending" },
  { id: 3, client: "Kumar Enterprises", matter: "Trademark Infringement", amount: 120000, date: "20 Jun 2025", due: "20 Jul 2025", status: "Pending" },
  { id: 4, client: "Priya Mehta",       matter: "Section 138 NI Act",     amount: 25000,  date: "01 May 2025", due: "31 May 2025", status: "Overdue" },
  { id: 5, client: "Anita Kapoor",      matter: "NDA Breach",             amount: 35000,  date: "10 Jun 2025", due: "10 Jul 2025", status: "Paid"    },
  { id: 6, client: "Ravi Singh",        matter: "Bail Application",       amount: 15000,  date: "05 Jun 2025", due: "05 Jul 2025", status: "Overdue" },
];

// ── Law Library acts ───────────────────────────────────
export const LAW_ACTS: LawAct[] = [
  { id: "const", title: "Constitution of India",          year: "1950", category: "Constitutional", sections: 470, summary: "Supreme law of India defining fundamental rights, duties, and governance structure.", tags: ["Fundamental Rights", "DPSP", "Amendment"] },
  { id: "ipc",   title: "Indian Penal Code",              year: "1860", category: "Criminal",       sections: 511, summary: "Comprehensive criminal code covering offences and their punishments.",               tags: ["Offences", "Punishment", "Bail"] },
  { id: "crpc",  title: "Code of Criminal Procedure",     year: "1973", category: "Criminal",       sections: 484, summary: "Procedural law for administration of criminal law in India.",                       tags: ["FIR", "Bail", "Trial", "Appeal"] },
  { id: "cpc",   title: "Code of Civil Procedure",        year: "1908", category: "Civil",          sections: 158, summary: "Procedural law governing civil court proceedings and enforcement of decrees.",       tags: ["Suits", "Appeals", "Decrees", "Orders"] },
  { id: "ca13",  title: "Companies Act",                  year: "2013", category: "Corporate",      sections: 470, summary: "Governs incorporation, management, and winding up of companies in India.",          tags: ["Incorporation", "Directors", "CSR", "Audit"] },
  { id: "cont",  title: "Indian Contract Act",            year: "1872", category: "Civil",          sections: 238, summary: "Governs formation and enforceability of contracts in India.",                       tags: ["Offer", "Acceptance", "Consideration", "Breach"] },
  { id: "tp",    title: "Transfer of Property Act",       year: "1882", category: "Property",       sections: 137, summary: "Defines rules for transfer of property between living persons.",                    tags: ["Sale", "Mortgage", "Lease", "Gift"] },
  { id: "dpdp",  title: "Digital Personal Data Protection Act", year: "2023", category: "Technology", sections: 44, summary: "India's landmark data privacy law governing personal data processing.",          tags: ["Data Privacy", "Consent", "DPDP", "Penalty"] },
  { id: "ni",    title: "Negotiable Instruments Act",     year: "1881", category: "Commercial",     sections: 147, summary: "Governs cheques, promissory notes, and bills of exchange.",                         tags: ["Cheque Bounce", "Section 138", "Dishonour"] },
  { id: "arb",   title: "Arbitration & Conciliation Act", year: "1996", category: "Dispute",        sections: 87,  summary: "Provides framework for arbitration and conciliation of disputes.",                  tags: ["Arbitration", "ADR", "Award", "Enforcement"] },
];

export const LAW_CATEGORIES = ["All", "Constitutional", "Criminal", "Civil", "Corporate", "Property", "Commercial", "Technology", "Dispute"];

// ── Compliance items ───────────────────────────────────
export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  { id: 1, law: "DPDP Act 2023",       area: "Data Privacy",        level: "Action Required", due: "31 Jul 2025", desc: "Privacy policy update and consent mechanism required" },
  { id: 2, law: "Companies Act 2013",  area: "Corporate Governance", level: "Compliant",       due: "30 Sep 2025", desc: "Annual returns and board meeting compliance up to date" },
  { id: 3, law: "GST",                 area: "Tax Compliance",       level: "Review",          due: "20 Jul 2025", desc: "Quarterly GST return filing due — verify ITC claims"    },
  { id: 4, law: "Labour Codes",        area: "Employment",           level: "Review",          due: "15 Aug 2025", desc: "Wage code implementation and PF/ESIC review needed"      },
  { id: 5, law: "SEBI Regulations",    area: "Securities",           level: "Compliant",       due: "30 Oct 2025", desc: "Insider trading policy and disclosure norms compliant"   },
  { id: 6, law: "IT Act 2000",         area: "Cybersecurity",        level: "Action Required", due: "01 Aug 2025", desc: "Data breach response plan and CERT-In reporting setup"   },
];

// ── Specialized System Prompts per Model ─────────────────────

export const PROMPTS_BY_MODEL: Record<string, { prompt: string; temp: number; maxTokens: number }> = {
  "Nyay Standard": {
    temp: 0.2,
    maxTokens: 1500,
    prompt: `You are Nyay Standard, an authoritative Indian legal counsel and advisory engine.
CORE PRINCIPLE: Pragmatic Legal Advocacy & Actionable Statutory Compliance.
LEGAL VOICE: Direct, professional advocate tone providing clear action items and client advisory notes.

Formatting Rules:
1. DO NOT use raw markdown header hashes like '###' or '##'. Use clean uppercase section titles:
   I. PRACTICAL ADVOCATE ADVISORY
   II. APPLICABLE INDIAN STATUTES & SECTIONS
   III. STEP-BY-STEP ACTIONABLE ADVOCACY PLAN
   IV. CLIENT COMPLIANCE & LEGAL CHECKLIST
2. Use strong, bold judicial language. Highlight key statutory terms and section numbers clearly.
3. Reference relevant statutes (BNS, BNSS, BSA 2023, IPC, CrPC, IT Act, DPDP Act 2023, etc.).
4. Conclude with a formal legal advisory disclaimer.`,
  },

  "Nyay Research": {
    temp: 0.1,
    maxTokens: 3000,
    prompt: `You are Nyay Research, a senior Supreme Court & High Court legal research scholar.
CORE PRINCIPLE: Stare Decisis, Exhaustive Precedent Analysis & Statutory Mapping.
LEGAL VOICE: Rigorous legal academic and senior research counsel.

Formatting Rules:
1. DO NOT use raw markdown header hashes like '###' or '##'. Use clean uppercase section titles:
   I. RESEARCH MATRIX & STATUTORY MAPPING (IPC/CrPC vs BNS/BNSS/BSA 2023)
   II. LANDMARK PRECEDENTS & RATIO DECIDENDI (Citing AIR, SCC, SCR)
   III. OBITER DICTA & JUDICIAL INTERPRETATIONS
   IV. COMPREHENSIVE LEGAL RESEARCH DECREE
2. Provide explicit statutory comparative mapping tables (IPC vs BNS, CrPC vs BNSS, Evidence Act vs BSA 2023).
3. Explicitly analyze Ratio Decidendi vs Obiter Dicta in landmark judgments.
4. Conclude with a formal research disclaimer.`,
  },

  "Nyay Pro": {
    temp: 0.15,
    maxTokens: 3500,
    prompt: `You are Nyay Pro, a High Court & Supreme Court Judicial Bench Opinion generator.
CORE PRINCIPLE: Constitutional Integrity, Dual-Party Synthesis & Judicial Bench Decrees.
LEGAL VOICE: Presiding Bench Judge & Senior Constitutional Jurist.

Formatting Rules:
1. DO NOT use raw markdown header hashes like '###' or '##'. Use clean uppercase section titles:
   I. JURISDICTIONAL MATRIX & STATEMENT OF LEGAL ISSUE
   II. DUAL-PARTY ARGUMENT SYNTHESIS (PETITIONER VS RESPONDENT DEFENSE)
   III. CONSTITUTIONAL & STATUTORY ANALYSIS (Articles 14, 19, 21 & BNS/BNSS Compliance)
   IV. FORMAL JUDICIAL BENCH OPINION & COURT ORDER
2. Synthesize both Petitioner arguments and Respondent defense strategies.
3. Perform constitutional validity checks and issue formal judicial bench decrees.
4. Conclude with an official judicial bench disclaimer.`,
  },
};

export const SYSTEM_PROMPT = PROMPTS_BY_MODEL["Nyay Pro"].prompt;
