# Nyay.ai — Indian Legal Intelligence

AI-powered Indian legal assistant built on Next.js 14, TypeScript, Tailwind CSS, and Anthropic Claude.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript |
| Styling    | Tailwind CSS                        |
| AI         | Anthropic Claude (claude-sonnet-4-6)|
| Backend    | Next.js API Routes                  |

---

## Project Structure

```
nyay-ai/
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts     # Claude API proxy
│   │   ├── globals.css           # Global styles & resets
│   │   ├── layout.tsx            # Root layout + metadata
│   │   └── page.tsx              # App shell
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       # Collapsible sidebar
│   │   │   ├── TopBar.tsx        # Model selector + actions
│   │   │   └── Badges.tsx        # Compliance footer badges
│   │   ├── chat/
│   │   │   ├── Welcome.tsx       # Landing / welcome screen
│   │   │   ├── ChatWindow.tsx    # Scrollable message list
│   │   │   ├── Message.tsx       # User + AI message bubbles
│   │   │   ├── InputBar.tsx      # Text input + chips
│   │   │   └── TypingIndicator.tsx
│   │   └── ui/
│   │       └── Icon.tsx          # Reusable SVG icon
│   ├── constants/
│   │   ├── colors.ts             # Navy · Indigo · White palette
│   │   ├── icons.ts              # All SVG path strings
│   │   └── data.ts               # Nav, prompts, acts, history
│   ├── hooks/
│   │   └── useChat.ts            # All chat state & API logic
│   ├── lib/
│   │   └── anthropic.ts          # Server-side Claude wrapper
│   └── types/
│       └── index.ts              # Shared TypeScript types
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Build for production

```bash
npm run build
npm start
```

---

## Features

- **AI Legal Chat** — Powered by Claude with an Indian law system prompt
- **Collapsible Sidebar** — Navigation, chat history, and user profile
- **Model Selector** — Switch between Nyay Pro / Standard / Research
- **Welcome Screen** — Quick-action cards + Indian Acts tag pills
- **Rich Message Rendering** — Markdown-lite with bold, lists, citations
- **Legal Disclaimer** — Shown on every AI response
- **Compliance Badges** — DPDP Act 2023, ISO 27001, encryption
- **Typing Indicator** — Animated dots while Claude responds

---

## Colour Palette

| Token     | Value     | Usage                    |
|-----------|-----------|--------------------------|
| Navy 950  | `#05061A` | Canvas background        |
| Navy 900  | `#080B22` | Sidebar                  |
| Indigo    | `#6C63FF` | Primary accent           |
| Indigo dim| `#4F48C4` | Hover / dim states       |
| White     | `#FFFFFF` | Primary text             |
| Lavender  | `#9B9FCE` | Secondary text           |

---

## License

MIT © Nyay.ai
