import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const token = session?.googleAccessToken ?? session?.googleIdToken;
  
  if (!token) {
    return NextResponse.json({ errors: [{ message: "Unauthorized" }] }, { status: 401 });
  }

  const origin = (process.env.DJANGO_API_URL || process.env.BACKEND_URL)?.replace(/\/$/, "");
  if (!origin) {
    return NextResponse.json({ errors: [{ message: "Server misconfigured" }] }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { action, serverName, serverId, enabled } = body;

    let mutation = '';
    let variables: any = { serverName };

    switch (action) {
      case 'activate':
        mutation = `
          mutation ConnectServer($serverName: String!) {
            connectMcpServer(name: $serverName) {
              success
              message
              tools {
                name
                description
                schema
              }
              serverName
              connectionStatus
            }
          }
        `;
        break;
      case 'deactivate':
        mutation = `
          mutation DisconnectServer($serverName: String!) {
            disconnectMcpServer(name: $serverName) {
              success
              message
            }
          }
        `;
        break;
      case 'setEnabled':
        mutation = `
          mutation SetServerEnabled($serverName: String!, $enabled: Boolean!) {
            setMcpServerEnabled(name: $serverName, enabled: $enabled) {
              name
              transport
              url
              command
              args
              enabled
            }
          }
        `;
        variables = { serverName, enabled };
        break;
      default:
        return NextResponse.json({ errors: [{ message: "Invalid action" }] }, { status: 400 });
    }

    const response = await fetch(`${origin}/api/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        query: mutation,
        variables 
      }),
    });

    const result = await response.json();
    if (!response.ok || result.errors) {
      throw new Error(result.errors?.[0]?.message || 'Action failed');
    }

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
