import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">MCP Assistant</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Simplifying Model Context Protocol server connections for everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/mcp" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                MCP Servers
              </Link>
              <Link href="/playground" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Playground
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MCP Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
