"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm bg-white dark:bg-neutral-950">
        <h1 className="text-2xl font-semibold mb-2">Welcome</h1>
        <p className="text-sm text-neutral-600 mb-6">Sign in to continue</p>
        <button
          className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}


