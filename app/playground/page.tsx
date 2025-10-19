"use client";
import { useEffect, useState } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/types/mcp";
import { useSession } from "next-auth/react";
import { ToolRenderer } from "@/components/playground/ToolRenderer";
import "@copilotkit/react-ui/styles.css";

const PlaygroundPage = () => {
  const { data: session } = useSession();

  const [sessionId, setSessionId] = useState<string | null>(null);

  const { setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: "gpt-4o-mini",
      status: null,
      sessionId: sessionId ?? "",
    },
  });

  useEffect(() => {
    let id = localStorage.getItem("copilot-kit-session");
    if (!id) {
      const email = session?.user?.email;
      if (email && email.endsWith("@gmail.com")) {
        id = email.replace(/@gmail\.com$/, "");
      } else {
        id = email || crypto.randomUUID();
      }
      localStorage.setItem("copilotkit-session", id);
    }
    setSessionId(id);

    setState((prevState: AgentState | undefined) => ({
      model: prevState?.model ?? "gpt-4o-mini",
      status: prevState?.status,
      sessionId: id,
    }));

  }, [session]);

  return (
    <div className="flex flex-col h-full">
      <ToolRenderer />
      <CopilotChat
        labels={{
          initial: "Hello! I am your MCP assistant. How can I help you today?",
          title: "MCP Playground",
          placeholder: "Ask about your connected servers...",
        }}
        className="h-full"
      />
    </div>
  );
};

export default PlaygroundPage;