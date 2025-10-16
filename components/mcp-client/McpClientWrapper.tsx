"use client";
import { useMemo } from "react";
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
    updateServer,
    handleServerAction,
    handleServerAdd,
    handleServerUpdate,
    handleServerDelete,
  } = useMcpServers(session);

  // Split servers into public and user servers
  const { publicServers, userServers } = useMemo(() => {
    if (!servers) return { publicServers: null, userServers: null };

    return {
      publicServers: servers.filter(s => s.isPublic || s.isShared),
      userServers: servers.filter(s => !s.isPublic && !s.isShared),
    };
  }, [servers]);

  return (
    <McpClientLayout
      publicServers={publicServers}
      userServers={userServers}
      publicLoading={loading}
      userLoading={loading}
      publicError={error}
      userError={error}
      session={session}
      onRefreshPublic={refresh}
      onRefreshUser={refresh}
      onServerAction={handleServerAction}
      onServerAdd={handleServerAdd}
      onServerUpdate={handleServerUpdate}
      onServerDelete={handleServerDelete}
      onUpdatePublicServer={updateServer}
      onUpdateUserServer={updateServer}
    />
  );
}
