import type { ReactNode } from "react";
import Link from "next/link";

export default function McpLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">MCP Servers</h1>
          <Link href="/" className="text-sm underline">Home</Link>
        </div>
        {children}
      </div>
    </div>
  );
}


