import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  EmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
// import OpenAI from "openai";

// const openai = new OpenAI();
// const serviceAdapter = new OpenAIAdapter({ openai } as any); // dont needed agent switching, agent switching
const serviceAdapter = new EmptyAdapter();
const runtime = new CopilotRuntime({
  remoteEndpoints: [
    {
      url: process.env.NEXT_PUBLIC_BACKEND_URL + "/api/copilotkit" || "http://localhost:8000/api/copilotkit",
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};