"use client";

import Link from "next/link";
import Image from "next/image";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { McpServer } from "@/types/mcp";
import { RECENT_MCP_SERVERS_QUERY } from "@/lib/graphql";

// GraphQL query for recent MCP servers - imported from lib/graphql.ts
const GET_RECENT_SERVERS = gql`${RECENT_MCP_SERVERS_QUERY}`;

function ServerItemSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-xl border border-border bg-card">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-20" />
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Recently Added</h2>
        <Link
          href="/mcp"
          className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          View All <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {servers.map((server, index) => (
          <Link key={server.id} href="/mcp">
            <div className="group flex flex-col gap-3 p-4 rounded-lg border border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105">
              {/* Icon and Badge Row */}
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center">
                  <Image
                    src="/servers/server.png"
                    alt="Server icon"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                {index < 2 && (
                  <Badge variant="default" className="text-xs px-2 py-0.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
                    NEW
                  </Badge>
                )}
              </div>

              {/* Server Info */}
              <div className="space-y-1.5">
                <h3 className="font-medium text-sm text-foreground/90 truncate group-hover:text-primary transition-colors">
                  {server.name}
                </h3>
                <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded-md font-normal">
                  {server.transport}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="md:hidden mt-6 text-center">
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
