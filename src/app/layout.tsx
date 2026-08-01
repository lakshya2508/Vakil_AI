import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:       "Nyay.ai — Indian Legal Intelligence",
  description: "AI-powered Indian legal assistant. Draft documents, research case law, analyse contracts, and ensure compliance.",
  keywords:    ["Indian law", "legal AI", "legal assistant", "IPC", "CrPC", "Companies Act"],
  authors:     [{ name: "Nyay.ai" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title:       "Nyay.ai — Indian Legal Intelligence",
    description: "AI-powered Indian legal assistant",
    type:        "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body className={inter.className} style={{ height: "100%", overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
