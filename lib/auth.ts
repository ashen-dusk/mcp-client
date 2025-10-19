// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

async function refreshGoogleToken(token: JWT) {
  try {
    const url = "https://oauth2.googleapis.com/token";

    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      googleIdToken: refreshedTokens.id_token, // 👈 fresh ID token
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // keep same if not returned
    };
  } catch (error) {
    console.error("Error refreshing Google token", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // 👈 ensures refresh_token
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // console.log("JWT callback called with token:", token, "and account:", account);
      // Initial sign in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          googleIdToken: account.id_token,
          refreshToken: account.refresh_token, // 👈 store refresh_token
          accessTokenExpires: Date.now() + (account.expires_at! * 1000),
        };
      }

      // Return previous token if not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token expired, refresh
      console.log("refreshing google token------------->", token);
      return await refreshGoogleToken(token);
    },

    async session({ session, token }) {
      // console.log("Session callback called with session:", session, "and token:", token);
      return {
        ...session,
        googleIdToken: token.googleIdToken as string | undefined,
      };
    },
  },
  pages: { signIn: "/signin" },
};
