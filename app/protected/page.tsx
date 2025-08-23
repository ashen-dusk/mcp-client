import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function Protected() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm bg-white dark:bg-neutral-950">
        <h1 className="text-2xl font-semibold mb-2">Protected</h1>
        <Link href="/" className="text-sm underline">Home</Link>
        <p className="text-sm text-neutral-600">Only visible when authenticated.</p>
      </div>
    </main>
  );
}


