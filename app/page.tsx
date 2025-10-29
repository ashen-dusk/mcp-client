import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Play,
  Shield,
  ArrowRight,
  MessageSquare,
  Plug
} from "lucide-react";
import RecentMcpServers from "@/components/RecentMcpServers";
import Categories from "@/components/Categories";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
     
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">

          {/* Tagline */}
          <p className="text-xl md:text-2xl mb-4 font-medium">
            Connect to remote MCP servers without the hassle
          </p>

          <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
            No subscriptions. No complex setup. Just instant access to Model Context Protocol servers through a simple, intuitive interface.
            Manage connections, explore tools, and interact with AI agents—all in one place.
          </p>

          {/* CTA Buttons */}
          {session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/mcp"
                className="group bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              >
                <Server className="h-5 w-5" />
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/playground"
                className="border-2 border-border bg-background text-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-accent transition-all hover:shadow-md hover:scale-105 flex items-center justify-center gap-2"
              >
                <Play className="h-5 w-5" />
                Try Playground
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/signin"
                className="group bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Shield className="h-5 w-5" />
                Sign In to Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="border-2 border-border bg-background text-foreground px-8 py-3.5 rounded-lg font-semibold hover:bg-accent transition-all hover:shadow-md hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Learn More
              </a>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-12">
            <span className="font-semibold">No Subscriptions</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-semibold">No Local Setup</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-semibold">Instant Access</span>
          </div>

          {/* Powered By - Hero */}
          <div className="pt-8 border-t border-border/30">
            <p className="text-xs font-semibold uppercase tracking-wider mb-4">Powered By</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* MCP Logo */}
              <div className="relative h-8 w-auto hover:scale-110 transition-transform">
                <Image
                  src="/technologies/mcp-light.webp"
                  alt="Model Context Protocol"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-95 hover:opacity-100 transition-opacity dark:hidden"
                />
                <Image
                  src="/technologies/mcp.webp"
                  alt="Model Context Protocol"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity hidden dark:block"
                />
              </div>

              {/* LangGraph Logo */}
              <div className="relative h-8 w-auto hover:scale-110 transition-transform">
                <Image
                  src="/technologies/langgraph-light.webp"
                  alt="LangGraph"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-95 hover:opacity-100 transition-opacity dark:hidden"
                />
                <Image
                  src="/technologies/langgraph.webp"
                  alt="LangGraph"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity hidden dark:block"
                />
              </div>

              {/* AGUI Logo */}
              <div className="relative h-8 w-auto hover:scale-110 transition-transform">
                <Image
                  src="/technologies/agui-light.webp"
                  alt="AGUI"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-95 hover:opacity-100 transition-opacity dark:hidden"
                />
                <Image
                  src="/technologies/agui.webp"
                  alt="AGUI"
                  width={100}
                  height={32}
                  className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity hidden dark:block"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-16 bg-muted/10">
        <Categories />
      </div>

      {/* Recent MCP Servers Section */}
      <div className="container mx-auto px-6 py-16">
        <RecentMcpServers />
      </div>

      {/* Feature Highlights Section */}
      <div id="features" className="container mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Direct access to MCP servers, simplified
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Skip the client setup and subscription fees. Connect to any remote MCP server instantly through your browser.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* MCP Client Card */}
          <div className="group bg-transparent border border-border rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Server className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">MCP Client</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Connect to remote MCP servers instantly. No local setup required—just add the URL and start exploring available tools in real-time.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">Remote Connections</Badge>
              <Badge variant="secondary" className="text-xs">Live Status</Badge>
              <Badge variant="secondary" className="text-xs">Tool Explorer</Badge>
            </div>
          </div>

          {/* AI Playground Card */}
          <div className="group bg-transparent border border-border rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">AI Playground</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Interactive chat interface powered by LangGraph agents with dynamic tool binding from your connected MCP servers.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">Smart Chat</Badge>
              <Badge variant="secondary" className="text-xs">Context-Aware</Badge>
              <Badge variant="secondary" className="text-xs">Tool Calling</Badge>
            </div>
          </div>

          {/* Dynamic Tool Integration Card */}
          <div className="group bg-transparent border border-border rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-primary/50">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plug className="h-8 w-8 text-foreground" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Dynamic Tools</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Automatically discover and bind tools from connected servers. Tools are scoped to your session for secure isolation.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">Auto Discovery</Badge>
              <Badge variant="secondary" className="text-xs">Session Scoped</Badge>
              <Badge variant="secondary" className="text-xs">Real-time Sync</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MCP Assistant. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
