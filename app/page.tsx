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
import RecentMcpServers from "@/components/home/RecentMcpServers";
import Categories from "@/components/home/Categories";
import McpArchitecture from "@/components/home/McpArchitecture";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">

      {/* Hero Section */}
      <div className="min-h-[90vh] flex flex-col justify-center px-6 pt-16 pb-20">
  <div className="container mx-auto text-center max-w-4xl">

    {/* Tagline */}
    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-5 tracking-tight">
      Connect to remote MCP servers <span className="text-primary">without the hassle</span>
    </h1>

    {/* Description */}
    <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
      <strong className="text-foreground">No subscriptions. No setup.</strong> Instant access to Model Context Protocol servers through a simple, intuitive interface.
    </p>

    {/* CTA Buttons – High Contrast Hover */}
    {session ? (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
        <Link
          href="/mcp"
          className="group inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold text-base shadow-md hover:shadow-xl hover:bg-primary/80 active:bg-primary/70 transition-all duration-200 hover:scale-105"
        >
          <Server className="h-4.5 w-4.5" />
          Explore MCP
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/playground"
          className="inline-flex items-center justify-center gap-2.5 border border-border bg-background/90 backdrop-blur-sm text-foreground px-7 py-3 rounded-lg font-semibold text-base hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
        >
          <Play className="h-4.5 w-4.5" />
          Try Playground
        </Link>
      </div>
    ) : (
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
        <Link
          href="/signin"
          className="group inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-7 py-3 rounded-lg font-semibold text-base shadow-md hover:shadow-xl hover:bg-primary/80 active:bg-primary/70 transition-all duration-200 hover:scale-105"
        >
          <Shield className="h-4.5 w-4.5" />
          Sign In
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <a
          href="#features"
          className="inline-flex items-center justify-center gap-2.5 border border-border bg-background/90 backdrop-blur-sm text-foreground px-7 py-3 rounded-lg font-semibold text-base hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-200 hover:scale-105"
        >
          Learn More
        </a>
      </div>
    )}

    {/* Powered By – Tighter, Even Gapping */}
    <div className="pt-8 border-t border-border/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Powered by
      </p>
      <div className="flex items-center justify-center gap-x-12 md:gap-x-16">
        {[
          { light: "/technologies/mcp-light.webp", dark: "/technologies/mcp.webp", label: "MCP" },
          { light: "/technologies/langgraph-light.webp", dark: "/technologies/langgraph.webp", label: "LangGraph" },
          { light: "/technologies/agui-light.webp", dark: "/technologies/agui.webp", label: "AGUI Protocol" },
        ].map((tech, i) => (
          <div
            key={i}
            className="group flex flex-col items-center gap-1.5 transition-transform duration-200 hover:scale-105"
          >
            <div className="relative h-8 w-auto">
              <Image
                src={tech.light}
                alt={tech.label}
                width={100}
                height={32}
                className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity dark:hidden"
              />
              <Image
                src={tech.dark}
                alt={tech.label}
                width={100}
                height={32}
                className="h-8 w-auto opacity-85 group-hover:opacity-100 transition-opacity hidden dark:block"
              />
            </div>
            <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">
              {tech.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      {/* Architecture Visualization Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-3xl mx-auto">
            A seamless flow from your interface to AI-powered agents with dynamic MCP server connections
          </p>
        </div>

        <div className="flex justify-center">
          <McpArchitecture className="max-w-6xl w-full" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-6 py-16">
        <Categories />
      </div>

      {/* Recent MCP Servers Section */}
      <div className="container mx-auto px-6 py-16">
        <RecentMcpServers />
      </div>

      {/* Feature Highlights Section */}
      <div id="features" className="relative py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl opacity-25" />
          <div className="absolute bottom-10 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Left side content */}
          <div className="max-w-xl mx-auto text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-foreground">
              Direct Access to MCP Servers, Simplified
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8">
              Skip the setup and subscriptions. Instantly connect to any remote MCP server through your browser — fast, secure, and ready to use.
            </p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full border border-primary/30 text-primary/90 text-xs font-medium bg-primary/5">
                No Client Setup
              </span>
              <span className="px-3 py-1 rounded-full border border-primary/30 text-primary/90 text-xs font-medium bg-primary/5">
                Instant Access
              </span>
              <span className="px-3 py-1 rounded-full border border-primary/30 text-primary/90 text-xs font-medium bg-primary/5">
                Secure Isolation
              </span>
            </div>
          </div>

          {/* Right side stacked cards */}
          <div className="space-y-6">
            {[
              {
                icon: <Server className="h-6 w-6 text-primary" />,
                title: "MCP Client",
                desc: "Instantly connect to remote MCP servers with zero local configuration — just a URL away.",
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-primary" />,
                title: "AI Playground",
                desc: "Chat with LangGraph agents that dynamically connect to your active MCP tools in real-time.",
              },
              {
                icon: <Plug className="h-6 w-6 text-primary" />,
                title: "Dynamic Tools",
                desc: "Automatically discover, bind, and execute remote tools scoped securely to your session.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative flex items-start gap-4 bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] hover:border-primary/40"
              >
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
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
