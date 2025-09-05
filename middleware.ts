import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;

    // If already signed in, prevent viewing /signin
    if (pathname.startsWith("/signin") && req.nextauth?.token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // allow unauthenticated access to /signin (so users can log in)
        if (pathname.startsWith("/signin")) return true;
        // require auth for protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/protected", "/signin"],
};