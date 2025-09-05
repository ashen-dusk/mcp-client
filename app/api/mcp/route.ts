import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MCP_SERVERS_QUERY } from "@/lib/graphql";

export async function GET() {
  const session = await getServerSession(authOptions);
  // console.log("session in mcp route", session);
  const token = session?.googleIdToken;
  if (!token) return NextResponse.json({ errors: [{ message: "Unauthorized" }] }, { status: 401 });

  const origin = (process.env.DJANGO_API_URL || process.env.BACKEND_URL)?.replace(/\/$/, "");
  if (!origin) return NextResponse.json({ errors: [{ message: "Server misconfigured" }] }, { status: 500 });
  const resp = await fetch(`${origin}/api/graphql`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: MCP_SERVERS_QUERY }),
    cache: "no-store",
  });

  const data = await resp.text();
  return new NextResponse(data, { status: resp.status, headers: { "content-type": "application/json" } });
}


