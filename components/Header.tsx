import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { NavigationLinks } from "@/components/NavigationLinks";

export default async function Header() {
  const session = await getServerSession(authOptions);
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-4">
        {/* Top Section - Logo and Profile */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Logo />
          </Link>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {session?.user ? (
              <ProfileDropdown user={session.user} />
            ) : (
              <Link href="/signin" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>

        {/* Bottom Section - Navigation Links */}
        <NavigationLinks />
      </div>
    </nav>
  );
}
