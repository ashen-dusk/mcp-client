import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm bg-white dark:bg-neutral-950">
          <h1 className="text-2xl font-semibold mb-2">Auth Starter</h1>
          <p className="text-sm text-neutral-600 mb-6">NextAuth + Google + App Router</p>
          {!session ? (
            <div className="flex gap-3">
              <Link href="/signin" className="rounded-lg bg-black text-white px-4 py-2">Sign in with Google</Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm">Signed in as {session.user?.email}</div>
              <div className="flex gap-3">
                <Link href="/api/auth/signout" className="rounded-lg border px-4 py-2">Sign out</Link>
                <Link href="/protected" className="rounded-lg border px-4 py-2">Protected page</Link>
              </div>
            </div>
          )}
          <Link href="/mcp" className="rounded-lg border px-4 py-2">MCP page</Link>
        </div>
      </div>
    </main>
  );
}
