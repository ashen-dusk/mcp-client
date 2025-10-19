"use client";
import { useEffect, useState, useCallback } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/types/mcp";
import { useSession } from "next-auth/react";
import { ToolRenderer } from "@/components/playground/ToolRenderer";
import "@copilotkit/react-ui/styles.css";
import ChatInput from "../../components/playground/ChatInput";

interface ChatInputWrapperProps {
  onSend: (message: string) => void;
}

const PlaygroundPage = () => {
  const { data: session } = useSession();

  const [sessionId, setSessionId] = useState<string | null>(null);

  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: "gpt-4o-mini",
      status: undefined,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Wrapper component that integrates with CopilotKit's input system
  const ChatInputWrapper = useCallback((props: ChatInputWrapperProps) => {
    return (
      <div className="w-full">
        <ChatInput
          onSendMessage={props.onSend}
          state={state}
          setState={setState}
        />
      </div>
    );
  }, [state, setState]);
  
  return (
    <div className="max-w-2xl mx-auto py-4">
      <ToolRenderer />
      <CopilotChat
        labels={{
          initial: "Hello! I am your MCP assistant. How can I help you today?",
          title: "MCP Playground",
          placeholder: "Ask about your connected servers...",
        }}
        className="h-[80vh]"
        Input={ChatInputWrapper}

      />
    </div>
  );
};

export default PlaygroundPage;