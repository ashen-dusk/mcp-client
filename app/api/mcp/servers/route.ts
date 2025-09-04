import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SAVE_MCP_SERVER_MUTATION, REMOVE_MCP_SERVER_MUTATION } from "@/lib/graphql";

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || "http://localhost:8000/graphql";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, transport, url, command, args, headers, queryParams, requiresOauth } = body;

    // Prepare headers and queryParams as JSON strings
    const headersJson = headers && Object.keys(headers).length > 0 ? JSON.stringify(headers) : null;
    const queryParamsJson = queryParams && Object.keys(queryParams).length > 0 ? JSON.stringify(queryParams) : null;
    const argsJson = args ? (typeof args === 'string' ? args : JSON.stringify(args)) : null;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query: SAVE_MCP_SERVER_MUTATION,
        variables: {
          name,
          transport,
          url,
          command,
          argsJson,
          headersJson,
          queryParamsJson,
          requiresOauth
        },
      }),
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      return NextResponse.json(
        { error: result.errors?.[0]?.message || "Failed to save server" },
        { status: response.status }
      );
    }

    return NextResponse.json({ data: result.data.saveMcpServer });
  } catch (error) {
    console.error("Error saving server:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const serverName = searchParams.get("name");

    if (!serverName) {
      return NextResponse.json({ error: "Server name is required" }, { status: 400 });
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify({
        query: REMOVE_MCP_SERVER_MUTATION,
        variables: { serverName },
      }),
    });

    const result = await response.json();
    
    if (!response.ok || result.errors) {
      return NextResponse.json(
        { error: result.errors?.[0]?.message || "Failed to remove server" },
        { status: response.status }
      );
    }

    return NextResponse.json({ data: result.data.removeMcpServer });
  } catch (error) {
    console.error("Error removing server:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
