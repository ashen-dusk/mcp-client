import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { Server, Play, Shield, ArrowRight } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
      <div className="w-full text-center">
          <h1 className="text-4xl font-bold mb-6">
            Model Context Protocol
            <span className="block text-primary">Management Platform</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Seamlessly manage, connect, and interact with MCP servers. Build powerful AI applications with our comprehensive toolkit.
          </p>
          
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/mcp" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Server className="h-5 w-5" />
                Open MCP Client
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/playground" className="border border-border text-foreground px-8 py-3 rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Try Playground
              </Link>
            </div>
          ) : (
            <Link href="/signin" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {/* What is MCP Section */}
          <div className="mt-16 text-left">
            <h2 className="text-2xl font-bold mb-4 text-center">
              What is Model Context Protocol (MCP)?
            </h2>
            <p className="text-muted-foreground mb-6">
              MCP is a standardized protocol that enables AI models to securely connect to external data sources and tools. 
              It provides a unified interface for models to access real-time information, perform actions, and interact with various services.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Benefits</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Secure and standardized connections</li>
                  <li>• Real-time data access and tool integration</li>
                  <li>• Extensible and developer-friendly</li>
                  <li>• Cross-platform compatibility</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Use Cases</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• AI assistants with real-time data</li>
                  <li>• Automated workflow integration</li>
                  <li>• Custom tool development</li>
                  <li>• Enterprise AI solutions</li>
                </ul>
              </div>
            </div>
          </div>
      </div>

      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "MCP Assistant",
          initial: "Hello! I'm here to help you with MCP server management and tool exploration.",
        }}
      />
    </div>
  );
}
