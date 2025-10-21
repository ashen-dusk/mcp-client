import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Client",
  description: "Web-based MCP (Model Context Protocol) client for managing servers and exploring tools",
  verification: {
    google: "Not4GrBnowoe9oFiAJ1p11C-olKqFaDIuPV-19X8tBo",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CopilotKit
              agent="mcpAssistant"
              runtimeUrl="/api/copilotkit"
              showDevConsole={false}
              transcribeAudioUrl="/api/transcribe"
              textToSpeechUrl="/api/tts"
            >
              <div className="min-h-screen bg-background">
                <div className="max-w-5xl mx-auto">
                  <Header />
                  <main>
                    {children}
                  </main>
                </div>
              </div>
            </CopilotKit>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
