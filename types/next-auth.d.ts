import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    googleIdToken?: string;
    googleAccessToken?: string;
    user: DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleIdToken?: string;
    googleRefreshToken?: string;
    googleIdTokenExp?: number;
    googleAccessToken?: string;
    googleAccessTokenExp?: number;
  }
}


