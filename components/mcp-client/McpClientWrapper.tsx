"use client";
import { Session } from "next-auth";
import McpClientLayout from "@/components/mcp-client/McpClientLayout";
import { useMcpServers } from "@/hooks/useMcpServers";

interface McpClientWrapperProps {
  session: Session | null;
}

export default function McpClientWrapper({ session }: McpClientWrapperProps) {
  const {
    servers,
    loading,
    error,
    refresh,
    restartServer,
    updateServer,
    handleServerAction,
    handleServerAdd,
    handleServerUpdate,
    handleServerDelete,
  } = useMcpServers(session);

  return (
    <McpClientLayout
      servers={servers}
      loading={loading}
      error={error}
      session={session}
      onRefresh={refresh}
      onServerAction={handleServerAction}
      onServerAdd={handleServerAdd}
      onServerUpdate={handleServerUpdate}
      onServerDelete={handleServerDelete}
      onUpdateServer={updateServer}
    />
  );
}
