"use client";
import { useSession } from "next-auth/react";
import { Server, User, Home, Code, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";

export default function CommonNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
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
                    <SignOutButton />
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
        
        {/* Bottom Section - Navigation Links */}
        <div className="flex items-center justify-center gap-6">
          <Link href="/" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link href="/mcp" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/mcp" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Server className="h-4 w-4" />
            MCP Client
          </Link>
          <Link href="/playground" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/playground" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <Code className="h-4 w-4" />
            Playground
          </Link>
        </div>
      </div>
    </nav>
  );
}
