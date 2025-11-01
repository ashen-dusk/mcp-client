"use client";

import {
  CatchAllActionRenderProps,
  useRenderToolCall,
  useLangGraphInterrupt,
} from "@copilotkit/react-core";
import MCPToolCall from "./MCPToolCall";
import { Button } from "@/components/ui/button";

export function ToolRenderer() {
  
  useRenderToolCall({
    name: "*",
    render: ({ name, status, args, result }: CatchAllActionRenderProps<[]>) => {
      return <MCPToolCall status={status} name={name} args={args} result={result} />;
    },
  });

  return null;
}
