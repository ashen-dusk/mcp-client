"use client";

import {
  CatchAllActionRenderProps,
  useRenderToolCall,
  useLangGraphInterrupt,
} from "@copilotkit/react-core";
import MCPToolCall from "./MCPToolCall";
import { Button } from "@/components/ui/button";

export function ToolRenderer() {
  useLangGraphInterrupt({
    enabled: ({ eventValue }) => eventValue?.type === "tool_approval_request",
    render: ({ event, resolve }) => {
      const toolData = event?.value || {};
      const toolArgs = toolData?.tool_args;
      const message = toolData?.message;

      return (
        <div className="flex items-start gap-3 px-3 py-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-7 h-7 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center text-xs font-medium">
            A
          </div>
          <div className="flex flex-col bg-muted/40 border border-border rounded-xl px-3 py-2 text-sm shadow-sm max-w-[80%]">
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

  useRenderToolCall({
    name: "*",
    render: ({ name, status, args, result }: CatchAllActionRenderProps<[]>) => {
      return <MCPToolCall status={status} name={name} args={args} result={result} />;
    },
  });

  return null;
}
