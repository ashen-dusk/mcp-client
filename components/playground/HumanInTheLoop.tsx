"use client";

import { useLangGraphInterrupt, useCoAgentStateRender } from "@copilotkit/react-core";
import { Button } from "@/components/ui/button";
import MCPToolCall from "./MCPToolCall";

interface ToolData {
  tool_args?: Record<string, unknown>;
  message?: string;
}

export default function HumanInTheLoop() {
  // Render tool call state using useCoAgentStateRender
  // This shows tool execution progress from agent state
  useCoAgentStateRender({
    name: "mcpAssistant",
    render: ({ state }) => {
      const currentToolCall = state?.current_tool_call;

      if (!currentToolCall) return null;

      const status = currentToolCall.status === "complete"
        ? "complete"
        : currentToolCall.status === "executing"
        ? "inProgress"
        : "executing";

      return (
        <MCPToolCall
          status={status}
          name={currentToolCall.name}
          args={currentToolCall.args}
          result={currentToolCall.result}
        />
      );
    },
  });

  // Human-in-the-Loop interrupt handler
  useLangGraphInterrupt({
    enabled: ({ eventValue }: { eventValue?: { type?: string } }) =>
      eventValue?.type === "tool_approval_request",
    render: ({ event, resolve }) => {
      const toolData = (event?.value || {}) as ToolData;
      const toolArgs = toolData?.tool_args;
      const message = toolData?.message;

      return (
        <div className="flex items-start animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col text-sm max-w-[80%]">
            <p className="text-foreground mb-2 leading-snug">
              {message}
            </p>
            {toolArgs && Object.keys(toolArgs).length > 0 && (
              <div className="mb-2 text-xs text-muted-foreground">
                <pre className="bg-background/50 p-2 rounded border border-border overflow-auto max-h-32">
                  {JSON.stringify(toolArgs, null, 2)}
                </pre>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                onClick={() => resolve?.(JSON.stringify({ approved: false, action: "CANCEL" }))}
                variant="outline"
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => resolve?.(JSON.stringify({ approved: true, action: "CONTINUE" }))}
                variant="default"
                className="cursor-pointer"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      );
    },
  });

  return null;
}
