"use client";
import { CopilotChat } from "@copilotkit/react-ui";

export default function PlaygroundPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 p-3">
        <h1 className="text-xl font-bold mb-2">MCP Playground</h1>
        <p className="text-muted-foreground mb-8">
          Interact with your MCP servers and explore their capabilities through our AI assistant.
        </p>
        
        <div className="h-[calc(100vh-200px)]">
          <CopilotChat
            instructions="You are an MCP (Model Context Protocol) assistant. Help users explore and interact with their MCP servers, understand available tools, and provide guidance on MCP server management."
            labels={{
              title: "MCP Assistant",
              initial: "Hello! I'm here to help you explore your MCP servers and their capabilities. What would you like to know?",
            }}
          />
        </div>
      </div>
    </div>
  );
}
