import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  EmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

const serviceAdapter = new EmptyAdapter();
const mcpAssistant = new HttpAgent({
  url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/langgraph-agent" || "http://localhost:8000/api/langgraph-agent",
});

const runtime = new CopilotRuntime({
  agents: {
    mcpAssistant,
  },
});

export const POST = async (req: NextRequest) => {

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  const response = await handleRequest(req);
  return response;
};