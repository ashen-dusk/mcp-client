import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import CommonNavigation from "@/components/CommonNavigation";
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
              agent="mcp-assistant"
              runtimeUrl="/api/copilotkit"
              showDevConsole={false}
              
            >
              <div className="min-h-screen bg-background">
                <div className="max-w-5xl mx-auto">
                  <CommonNavigation />
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
