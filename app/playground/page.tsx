"use client";
import { useEffect, useState } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/types/mcp";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

const PlaygroundPage = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let id = localStorage.getItem("copilot-kit-session");
    if (!id) {
      let email = session?.user?.email;
      if (email && email.endsWith("@gmail.com")) {
        id = email.replace(/@gmail\.com$/, "");
      } else {
        id = email || crypto.randomUUID();
      }
      localStorage.setItem("copilotkit-session", id);
    }
    setSessionId(id);
  }, [session]);

  const lightTheme: CopilotKitCSSProperties = {
    "--copilot-kit-background-color": "#ffffff",
    "--copilot-kit-primary-color": "#000000",
    "--copilot-kit-contrast-color": "#ffffff",
    "--copilot-kit-secondary-color": "#f7f7f7",
    "--copilot-kit-secondary-contrast-color": "#000000",
    "--copilot-kit-separator-color": "#e6e6e6",
    "--copilot-kit-muted-color": "#6b7280",
  };

  const darkTheme: CopilotKitCSSProperties = {
    "--copilot-kit-background-color": "#18181b",
    "--copilot-kit-primary-color": "#f5f5f5",
    "--copilot-kit-contrast-color": "#18181b",
    "--copilot-kit-secondary-color": "#2a2a2a",
    "--copilot-kit-secondary-contrast-color": "#f5f5f5",
    "--copilot-kit-separator-color": "#333333",
    "--copilot-kit-muted-color": "#a0a0a0",
  };

  const { state, setState } = useCoAgent<AgentState>({
    name: "mcp-assistant",
    initialState: {
      model: "gpt-4o-mini",
      status: null,
      sessionId: sessionId ?? "",
    },
  });

  return (
    <div className="flex flex-col h-full">
      <p className="mb-4 text-gray-500 dark:text-gray-400">
        Interact with your connected MCP servers using the chat interface below.
      </p>
      <div className="flex-grow" style={isDarkMode ? darkTheme : lightTheme}>
        <CopilotChat
          labels={{
            initial: "Hello! I am your MCP assistant. How can I help you today?",
            title: "MCP Assistant",
            placeholder: "Ask about your connected servers...",
          }}
        />
      </div>
    </div>
  );
};

export default PlaygroundPage;
