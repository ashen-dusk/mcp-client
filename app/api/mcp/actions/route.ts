import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  CONNECT_MCP_SERVER_MUTATION,
  DISCONNECT_MCP_SERVER_MUTATION,
  RESTART_MCP_SERVER_MUTATION,
  SET_MCP_SERVER_ENABLED_MUTATION
} from "@/lib/graphql";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.googleIdToken;

  const origin = (process.env.DJANGO_API_URL || process.env.BACKEND_URL)?.replace(/\/$/, "");
  if (!origin) {
    return NextResponse.json({ errors: [{ message: "Server misconfigured" }] }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, serverName, enabled } = body;

    let mutation = '';
    let variables: Record<string, unknown> = { serverName };

    switch (action) {
      case 'activate':
        mutation = CONNECT_MCP_SERVER_MUTATION;
        break;
      case 'deactivate':
        mutation = DISCONNECT_MCP_SERVER_MUTATION;
        break;
      case 'setEnabled':
        mutation = SET_MCP_SERVER_ENABLED_MUTATION;
        variables = { serverName, enabled };
        break;
      case 'restart':
        mutation = RESTART_MCP_SERVER_MUTATION;
        variables = { name: serverName };
        break;
      default:
        return NextResponse.json({ errors: [{ message: "Invalid action" }] }, { status: 400 });
    }

    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    
    // Only add authorization header if token is available
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${origin}/api/graphql`, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        query: mutation,
        variables 
      }),
    });

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response from GraphQL endpoint:", text);
      throw new Error("Backend server returned invalid response");
    }

    const result = await response.json();

    console.log('[MCP Actions] GraphQL Response:', JSON.stringify(result, null, 2));

    if (!response.ok || result.errors) {
      throw new Error(result.errors?.[0]?.message || 'Action failed');
    }

    // Check if OAuth is required for activation or restart
    if (action === 'activate' && result.data?.connectMcpServer?.requiresAuth) {
      const connectResult = result.data.connectMcpServer;
      console.log('[MCP Actions] OAuth required for activation! Returning auth URL:', connectResult.authorizationUrl);
      return NextResponse.json({
        data: {
          connectMcpServer: {
            ...connectResult,
            requiresAuth: true,
            authorizationUrl: connectResult.authorizationUrl,
            state: connectResult.state
          }
        }
      });
    }

    if (action === 'restart' && result.data?.restartMcpServer?.requiresAuth) {
      const restartResult = result.data.restartMcpServer;
      console.log('[MCP Actions] OAuth required for restart! Returning auth URL:', restartResult.authorizationUrl);
      return NextResponse.json({
        data: {
          restartMcpServer: {
            ...restartResult,
            requiresAuth: true,
            authorizationUrl: restartResult.authorizationUrl,
            state: restartResult.state
          }
        }
      });
    }

    console.log('[MCP Actions] No OAuth required, returning normal result');
    // Return the result with the updated server data
    return NextResponse.json(result);
  } catch (error) {
    console.error("MCP action error:", error);
    return NextResponse.json(
      { errors: [{ message: error instanceof Error ? error.message : "Internal server error" }] }, 
      { status: 500 }
    );
  }
}
