"use client";

import {
  useRenderToolCall,
  type ActionRenderPropsNoArgs,
} from "@copilotkit/react-core";
import type React from "react";
import MCPToolCall from "./MCPToolCall";

type RenderProps = ActionRenderPropsNoArgs<[]> & { name?: string };

const render: React.ComponentType<RenderProps> = (props: RenderProps) => {
  const { name = "", status, args, result } = props;
  const toolStatus = (status === "complete" || status === "inProgress" || status === "executing") 
    ? status 
    : "executing";
  return <MCPToolCall status={toolStatus} name={name} args={args} result={result} />;
};

export function ToolRenderer() {
  
  useRenderToolCall({
    name: "*",
    render: render as (props: ActionRenderPropsNoArgs<[]>) => React.ReactElement,
  });

  return null;
}
