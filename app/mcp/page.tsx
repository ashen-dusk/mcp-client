"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
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
      toast.success("Servers loaded successfully");
    } catch (e: any) {
      const errorMessage = e?.message ?? "Failed to load servers";
      setError(errorMessage);
      toast.error(errorMessage);
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

      // Update local state instead of refetching all data
      setServers(prevServers => {
        if (!prevServers) return prevServers;
        return prevServers.map(server => {
          if (server.name === serverName) {
            // Get updated data from response if available
            const updatedServer = result.data?.connectMcpServer || result.data?.disconnectMcpServer;
            
            return {
              ...server,
              connectionStatus: updatedServer?.connectionStatus || 
                (action === 'activate' ? 'connected' : 'disconnected'),
              tools: updatedServer?.tools || server.tools,
              // Update timestamp to reflect the change
              updated_at: new Date().toISOString()
            };
          }
          return server;
        });
      });
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
      throw error;
    }
  };

  const handleServerAdd = async (data: any) => {
    const response = await fetch('/api/mcp/servers', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to add server');
    }

    // Refresh servers list
    await fetchServers();
  };

  const handleServerUpdate = async (data: any) => {
    const response = await fetch('/api/mcp/servers', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to update server');
    }

    // Refresh servers list
    await fetchServers();
  };

  const handleServerDelete = async (serverName: string) => {
    const response = await fetch(`/api/mcp/servers?name=${encodeURIComponent(serverName)}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to delete server');
    }

    // Refresh servers list
    await fetchServers();
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
      onServerAdd={handleServerAdd}
      onServerUpdate={handleServerUpdate}
      onServerDelete={handleServerDelete}
    />
  );
}