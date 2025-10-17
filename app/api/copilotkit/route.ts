import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  EmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
// import { headers } from "next/headers";
import { HttpAgent } from "@ag-ui/client";

// import OpenAI from "openai";

// const openai = new OpenAI();
// const serviceAdapter = new OpenAIAdapter({ openai } as any); // dont needed agent switching, agent switching
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
  
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
};