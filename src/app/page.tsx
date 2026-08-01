"use client";

import { useChat } from "@/hooks/useChat";
import { C } from "@/constants/colors";

// Layout
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import Badges from "@/components/layout/Badges";
import PrivacyConsent from "@/components/layout/PrivacyConsent";

// Chat section
import ChatTabs from "@/components/chat/ChatTabs";
import Welcome from "@/components/chat/Welcome";
import ChatWindow from "@/components/chat/ChatWindow";
import InputBar from "@/components/chat/InputBar";
import LawLibrary from "@/components/chat/tabs/LawLibrary";
import CaseResearch from "@/components/chat/tabs/CaseResearch";
import ComplianceTab from "@/components/chat/tabs/ComplianceTab";

// Nav sections
import DocumentsSection from "@/components/sections/DocumentsSection";
import MattersSection from "@/components/sections/MattersSection";
import ClientsSection from "@/components/sections/ClientsSection";
import CalendarSection from "@/components/sections/CalendarSection";
import BillingSection from "@/components/sections/BillingSection";

export default function Home() {
  const chat = useChat();
  const isChatNav = chat.activeNav === "chat";

  const handleCopyToChat = (text: string) => {
    chat.setInput(text);
    chat.setActiveTab("legal-chat");
    setTimeout(() => {
      chat.inputRef.current?.focus();
    }, 50);
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", background: C.bg, overflow: "hidden" }}
      onClick={() => chat.modelOpen && chat.setModelOpen(false)}
    >
      <PrivacyConsent />

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar
        open={chat.sidebarOpen}
        onToggle={() => chat.setSidebarOpen((p) => !p)}
        activeNav={chat.activeNav}
        onNavChange={(id) => {
          chat.setActiveNav(id);
        }}
        activeChat={chat.activeChat}
        onChatSelect={(id) => {
          chat.setActiveChat(id);
          chat.setShowWelcome(false);
          chat.setActiveNav("chat");
        }}
        onNewChat={chat.startNewChat}
      />

      {/* ── Main column ─────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar
          selectedModel={chat.selectedModel}
          modelOpen={chat.modelOpen}
          onModelToggle={() => chat.setModelOpen((p) => !p)}
          onModelSelect={(m) => {
            chat.setSelectedModel(m);
            chat.setModelOpen(false);
          }}
          onSidebarToggle={() => chat.setSidebarOpen((p) => !p)}
        />

        {/* ── Section routing ──────────────────────── */}
        {isChatNav ? (
          /* CHAT SECTION */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* 5-tab nav */}
            <ChatTabs activeTab={chat.activeTab} onTabChange={chat.setActiveTab} />

            {/* Tab content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Legal Chat */}
              {chat.activeTab === "legal-chat" &&
                (chat.showWelcome ? (
                  <Welcome onPrompt={chat.sendMessage} selectedModel={chat.selectedModel} />
                ) : (
                  <ChatWindow messages={chat.messages} loading={chat.loading} model={chat.selectedModel} bottomRef={chat.bottomRef} />
                ))}

              {/* Law Library */}
              {chat.activeTab === "law-library" && (
                <LawLibrary onPrompt={chat.sendMessage} onCopyToChat={handleCopyToChat} />
              )}

              {/* Documents (within chat — quick-gen) */}
              {chat.activeTab === "documents" && <DocumentsSection />}

              {/* Case Research */}
              {chat.activeTab === "case-research" && (
                <CaseResearch onPrompt={chat.sendMessage} onCopyToChat={handleCopyToChat} />
              )}

              {/* Compliance */}
              {chat.activeTab === "compliance" && <ComplianceTab onPrompt={chat.sendMessage} />}
            </div>

            {/* Input bar only for Legal Chat tab */}
            {chat.activeTab === "legal-chat" && (
              <InputBar
                input={chat.input}
                loading={chat.loading}
                inputRef={chat.inputRef}
                attachments={chat.attachments}
                isRecording={chat.isRecording}
                recordingSeconds={chat.recordingSeconds}
                isWebSearch={chat.isWebSearch}
                selectedModel={chat.selectedModel}
                onChange={chat.setInput}
                onKeyDown={chat.handleKeyDown}
                onSend={() => chat.sendMessage()}
                onChip={chat.sendMessage}
                onAddFiles={chat.addFiles}
                onRemoveAttachment={chat.removeAttachment}
                onStartVoice={chat.startVoiceRecording}
                onStopVoice={chat.stopVoiceRecording}
                onToggleWebSearch={chat.toggleWebSearch}
              />
            )}
          </div>
        ) : (
          /* OTHER NAV SECTIONS */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {chat.activeNav === "docs" && <DocumentsSection />}
            {chat.activeNav === "matters" && (
              <MattersSection
                matters={chat.matters}
                onAddMatter={chat.addMatter}
                onUpdateStatus={chat.updateMatterStatus}
              />
            )}
            {chat.activeNav === "clients" && (
              <ClientsSection
                clients={chat.clients}
                onAddClient={chat.addClient}
                onDeleteClient={chat.deleteClient}
              />
            )}
            {chat.activeNav === "calendar" && (
              <CalendarSection
                events={chat.events}
                onAddEvent={chat.addEvent}
                onDeleteEvent={chat.deleteEvent}
              />
            )}
            {chat.activeNav === "billing" && (
              <BillingSection
                invoices={chat.invoices}
                onAddInvoice={chat.addInvoice}
                onUpdateStatus={chat.updateInvoiceStatus}
              />
            )}
          </div>
        )}

        <Badges />
      </div>
    </div>
  );
}
