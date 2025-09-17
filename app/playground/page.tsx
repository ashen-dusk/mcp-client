"use client";
import { useEffect, useState } from "react";
import { CopilotChat } from "@copilotkit/react-ui";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import { useCoAgent, useCoAgentStateRender } from "@copilotkit/react-core";
import { AgentState } from "@/types/mcp";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { Search } from "lucide-react"; // icon for section title

const PlaygroundPage = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [sessionId, setSessionId] = useState<string | null>(null);
  const { state, setState } = useCoAgent<AgentState>({
    name: "mcp-assistant",
    initialState: {
      model: "gpt-4o-mini",
      status: null,
      sessionId: sessionId ?? "",
    },
  });

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
    setState((prev: any) => ({
      ...prev,
      sessionId: id,
    }));
  }, [session]);

  // Enhanced types for tool calls
  type McpToolCall = {
    name: string;
    result?: any; // Object, e.g., for tavily_search
    tool_call_id?: string;
    status?: "pending" | "running" | "completed" | "error"; // Optional status for dynamic feel
  };
  type ExtendedAgentState = AgentState & { tool_calls?: McpToolCall[] };

  useCoAgentStateRender<ExtendedAgentState>({
    name: "mcp-assistant",
    nodeName: 'tools',
    render: ({ state }) => {
      console.log("state", state); // Moved inside for cleanliness

      if (!state?.tool_calls?.length) return null;

      return (
        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Recent Tool Calls
          </h3>
          <div className="space-y-3">
            {state.tool_calls.map((tc, idx) => {
              const resultObj = tc.result ?? {};
              const pretty = JSON.stringify(resultObj, null, 2);
              const ts = (tc as any)?.timestamp;
              const when = ts ? new Date(ts).toLocaleString() : undefined;

              return (
                <div
                  key={tc.tool_call_id || idx}
                  className="relative bg-white p-4 transition-all dark:bg-neutral-900"
                >
                  {/* Header */}
                  <div className="mb-2">
                    <h4 className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
                      {tc.name?.replace(/_/g, " ").toUpperCase() || "TOOL"}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {when ? when : ""}
                    </p>
                  </div>

                  {/* Collapsible full JSON */}
                  <details className="group">
                    <summary className="text-xs cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
                      View raw JSON <span className="transition-transform group-open:rotate-180">▼</span>
                    </summary>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">
                        {tc.tool_call_id ? `id: ${tc.tool_call_id}` : ""}
                      </div>
                      <button
                        type="button"
                        className="rounded border px-2 py-1 text-[11px] hover:bg-accent"
                        onClick={() => navigator.clipboard?.writeText(pretty)}
                      >
                        Copy JSON
                      </button>
                    </div>
                    <pre className="mt-2 max-h-80 overflow-auto rounded bg-muted p-2 text-[11px] leading-5">
{pretty}
                    </pre>
                  </details>
                </div>
              );
            })}
          </div>
        </div>
      );
    },
  });

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

  return (
    <div className="flex flex-col h-full gap-4">
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