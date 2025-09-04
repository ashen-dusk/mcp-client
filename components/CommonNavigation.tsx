import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Server, Play, User, Home, Code, ChevronDown, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default async function CommonNavigation() {
  const session = await getServerSession(authOptions);
  
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Server className="h-6 w-6 text-primary" />
              MCP Platform
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link href="/playground" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Code className="h-4 w-4" />
                Playground
              </Link>
              <Link href="/mcp" className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Server className="h-4 w-4" />
                MCP Client
              </Link>
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "Profile"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="flex items-center gap-2 text-red-600">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
