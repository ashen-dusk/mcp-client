"use client";

import {
  useRenderToolCall,
} from "@copilotkit/react-core";
import MCPToolCall from "./MCPToolCall";

export function ToolRenderer() {
  
  useRenderToolCall({
    name: "*",
    render: (props: any) => {
      const { name, status, args, result } = props as { name: string; status: any; args: any; result: any };
      return <MCPToolCall status={status} name={name} args={args} result={result} />;
    },
  });

  return null;
}
