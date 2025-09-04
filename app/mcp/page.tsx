"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import McpClientLayout from "@/components/mcp-client/McpClientLayout";
import { McpServer } from "@/types/mcp";

export default function McpPage() {
  const { data: session } = useSession();
  const [servers, setServers] = useState<McpServer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/mcp`, { method: "GET" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.errors?.[0]?.message || res.statusText);
      setServers(json?.data?.mcpServers ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load servers");
    } finally {
      setLoading(false);
    }
  };

  const handleServerAction = async (serverName: string, action: 'restart' | 'activate' | 'deactivate') => {
    try {
      if (action === 'restart') {
        // For restart, we'll disconnect then connect
        await handleServerAction(serverName, 'deactivate');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
        return handleServerAction(serverName, 'activate');
      }

      const response = await fetch('/api/mcp/actions', {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ 
          action,
          serverName
        }),
      });

      const result = await response.json();
      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Action failed');
      }

      // Refresh servers after successful action
      await fetchServers();
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
      throw error;
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  return (
    <McpClientLayout
      servers={servers}
      loading={loading}
      error={error}
      onRefresh={fetchServers}
      onServerAction={handleServerAction}
    />
  );
}