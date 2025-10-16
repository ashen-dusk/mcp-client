"use client";
import { Home, Server, Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavigationLinks() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center gap-6">
      <Link
        href="/"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Home className="h-4 w-4" />
        Home
      </Link>
      <Link
        href="/mcp"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          pathname === "/mcp" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Server className="h-4 w-4" />
        MCP Client
      </Link>
      <Link
        href="/playground"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          pathname === "/playground" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Code className="h-4 w-4" />
        Playground
      </Link>
    </div>
  );
}
