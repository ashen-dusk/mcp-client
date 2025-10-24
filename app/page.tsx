import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import {
  Server,
  Play,
  Shield,
  ArrowRight,
  Zap,
  MessageSquare
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Beta Banner */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border-b border-yellow-200 dark:border-yellow-900/30">
        <div className="container mx-auto px-6 py-3">
          <p className="text-center text-sm text-yellow-800 dark:text-yellow-400 flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span><strong>Beta Version</strong> — This app is still in development. Features may change or be unstable.</span>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
            Ready to Get Started?
            <span
              className="bg-black/5 text-black/70 border border-black/10 dark:bg-white/10 dark:text-white/70 dark:border-white/20 text-[10px] px-1.5 py-0.5 rounded-lg uppercase font-bold tracking-wide"
              title="This app is in beta — features may change."
            >
              Beta
            </span>
          </h1>
          
          <p className="text-base text-muted-foreground mb-6 max-w-xl mx-auto">
            Sign in to access the MCP client and playground
          </p>
          
          {session ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link href="/mcp" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Server className="h-4 w-4" />
                Open MCP Client
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link href="/playground" className="border border-border text-foreground px-6 py-2 rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2">
                <Play className="h-4 w-4" />
                Try Playground
              </Link>
            </div>
          ) : (
            <Link href="/signin" className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sign In
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex-1 border-t border-border"></div>
          <div className="px-4">
            <div className="p-1 rounded-full bg-muted">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
          <div className="flex-1 border-t border-border"></div>
        </div>

        {/* What's Available */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Server className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">MCP Client</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Manage your MCP servers, view connection status, and explore available tools.
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="secondary" className="text-xs">Server Management</Badge>
              <Badge variant="secondary" className="text-xs">Tool Explorer</Badge>
              <Badge variant="secondary" className="text-xs">Connection Status</Badge>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MessageSquare className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Playground</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Chat with an AI assistant that can help you explore your MCP servers and tools.
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              <Badge variant="secondary" className="text-xs">Interactive Chat</Badge>
              <Badge variant="secondary" className="text-xs">Mcp based context</Badge>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
