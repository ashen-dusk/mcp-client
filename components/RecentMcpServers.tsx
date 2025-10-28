"use client";

import Link from "next/link";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Server, ArrowRight } from "lucide-react";
import { McpServer } from "@/types/mcp";
import { RECENT_MCP_SERVERS_QUERY } from "@/lib/graphql";

// GraphQL query for recent MCP servers - imported from lib/graphql.ts
const GET_RECENT_SERVERS = gql`${RECENT_MCP_SERVERS_QUERY}`;

function ServerItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4">
      <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

export default function RecentMcpServers() {
  // Use Apollo Client to fetch recent servers directly with GraphQL
  const { loading, error, data } = useQuery(GET_RECENT_SERVERS, {
    variables: {
      first: 4,
      order: { createdAt: "DESC" }, // Order by creation date descending (newest first)
    },
    fetchPolicy: "cache-and-network", // Always fetch fresh data while showing cached
  });

  // Extract nodes from edges structure
  const edges = data?.mcpServers?.edges || [];
  const servers: McpServer[] = edges.map((edge: any) => edge.node);

  // Handle error state - hide section
  if (error) {
    console.error("Failed to load recent servers:", error);
    return null;
  }

  // Show only loading skeletons (no heading) while loading
  if (loading && servers.length === 0) {
    return (
      <div className="w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ServerItemSkeleton />
          <ServerItemSkeleton />
          <ServerItemSkeleton />
          <ServerItemSkeleton />
        </div>
      </div>
    );
  }

  // Hide section if no servers
  if (servers.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Recently Added</h2>
        <Link
          href="/mcp"
          className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          View All <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {servers.map((server, index) => (
          <Link key={server.id} href="/mcp">
            <div className="group flex items-center gap-3 p-4 hover:bg-muted/20 rounded-lg transition-all duration-200 cursor-pointer">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors flex-shrink-0">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {server.name}
                  </h3>
                  {index < 2 && (
                    <Badge variant="default" className="text-xs px-2 py-0.5 bg-primary text-primary-foreground">
                      NEW
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  {server.transport}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="md:hidden mt-4 text-center">
        <Link
          href="/mcp"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View All Servers <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
