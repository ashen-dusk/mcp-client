"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type ToolInfo = { name: string; description: string; schema: string };
type McpServer = {
  name: string;
  transport: string;
  url?: string | null;
  command?: string | null;
  argsJson?: string | null;
  enabled: boolean;
  connectionStatus: string;
  updatedAt?: number | null;
  tools: ToolInfo[];
};

export default function McpPage() {
  const [servers, setServers] = useState<McpServer[] | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/mcp`, { method: "GET" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.errors?.[0]?.message || res.statusText);
        setServers(json?.data?.mcpServers ?? []);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load");
      }
    })();
  }, []);

  if (error) return <div className="rounded-xl border border-red-200 text-red-700 p-4">{error}</div>;
  if (servers == null) return <div className="text-sm text-neutral-500">Loading...</div>;

  return (
    <div>
      {servers.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 text-sm text-neutral-600">No servers found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {servers.map((s) => (
            <div key={s.name} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-medium">{s.name}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${s.enabled ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"}`}>{s.enabled ? "Enabled" : "Disabled"}</span>
              </div>
              <div className="text-xs text-neutral-500 mb-3">{s.transport} • {s.connectionStatus}</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {s.url && <div><span className="text-neutral-500">URL:</span> {s.url}</div>}
                {s.command && <div><span className="text-neutral-500">Cmd:</span> {s.command}</div>}
                {s.argsJson && <div className="col-span-2"><span className="text-neutral-500">Args:</span> <code className="text-xs">{s.argsJson}</code></div>}
                {s.updatedAt && <div><span className="text-neutral-500">Updated:</span> {new Date(s.updatedAt * 1000).toLocaleString()}</div>}
              </div>
              {s.tools?.length ? (
                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Tools</div>
                  <div className="flex flex-wrap gap-2">
                    {s.tools.map((t) => (
                      <div key={t.name} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-2 text-xs">
                        <div className="font-medium">{t.name}</div>
                        <div className="text-neutral-500">{t.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


