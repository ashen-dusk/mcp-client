import { Metadata } from "next";
import { Clock, Wrench, Bug, Sparkles, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog | MCP Assistant",
  description: "Latest updates, improvements, and bug fixes for MCP Assistant",
};

interface Change {
  description: string;
  subItems?: string[];
}

interface ChangeGroup {
  category: "new" | "fixed" | "improved";
  changes: Change[];
}

interface ChangelogEntry {
  version: string;
  date: string;
  groups: ChangeGroup[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "1.5.0",
    date: "October 27, 2025",
    groups: [
      {
        category: "improved",
        changes: [
          { description: "Remove toast notifications for server actions and loading states in MCP components" },
          { description: "Refactor error handling and logging in API routes" },
          { description: "Refactor OAuth storage and clean up unused code in backend" },
          { description: "Refactor logging in OAuth helper functions" },
        ]
      },
    ]
  },
  {
    version: "1.4.0",
    date: "October 26, 2025",
    groups: [
      {
        category: "new",
        changes: [
          { description: "Add MCP OAuth Implementation Guide documentation" },
          { description: "Add OAuth flow support for MCP servers with SimpleTokenAuth" },
        ]
      },
      {
        category: "improved",
        changes: [
          { description: "Implement OAuth flow for MCP server actions and enhance logging" },
          { description: "Refactor OAuth handling and introduce SimpleTokenAuth" },
          { description: "Refactor MCP server connection and OAuth handling" },
        ]
      },
    ]
  },
  {
    version: "1.3.0",
    date: "October 24-25, 2025",
    groups: [
      {
        category: "new",
        changes: [
          { description: "Implement homepage redesign with improved layout and branding" },
          { description: "Add privacy policy page" },
          { description: "Enhance Header component with branding and beta indication" },
        ]
      },
      {
        category: "improved",
        changes: [
          { description: "Refactor MCPToolCall component for improved readability and structure" },
          { description: "Enhance error handling in MCPToolCall component" },
          { description: "Refactor UI components for improved styling and consistency" },
          { description: "Enhance McpClientLayout with image integration for server icons" },
          { description: "Refactor UI elements and improve accessibility across multiple pages" },
          { description: "Enhance user authentication flow and UI in multiple components" },
          { description: "Add support for OpenRouter models in backend" },
          { description: "Add comprehensive logging across oauth_storage" },
        ]
      },
    ]
  },
  {
    version: "1.2.0",
    date: "October 23, 2025",
    groups: [
      {
        category: "new",
        changes: [
          { description: "Add server description field support and UI integration" },
          { description: "Add audio transcription endpoint in backend" },
        ]
      },
      {
        category: "improved",
        changes: [
          { description: "Implement custom minimal scrollbar and enhance ServerFormModal layout" },
          { description: "Enhance logging in Google token refresh process" },
          { description: "Enhance Google token management with JWT expiry decoding" },
          { description: "Refine OAuth2 indication and badge styling in McpClientLayout" },
          { description: "Enhance server management with description support and UI improvements" },
          { description: "Refactor ServerFormModal to use Controller for checkbox inputs" },
        ]
      },
    ]
  },
  {
    version: "1.1.0",
    date: "October 21-22, 2025",
    groups: [
      {
        category: "new",
        changes: [
          { description: "Add ToolsExplorer component to McpClientLayout for enhanced tool management" },
        ]
      },
      {
        category: "improved",
        changes: [
          { description: "Enhance styling and responsiveness in Playground and ChatInput components" },
          { description: "Refactor model state management in ChatInput for improved clarity" },
          { description: "Refactor sessionId handling in ChatInput for improved clarity and efficiency" },
          { description: "Refactor sessionId generation to improve handling for authenticated and anonymous users" },
          { description: "Update ChatInput to ensure sessionId generation only occurs in browser environment" },
          { description: "Refactor AgentState model to enforce explicit model type" },
        ]
      },
      {
        category: "fixed",
        changes: [
          { description: "Fix server-side rendering errors with sessionId generation" },
        ]
      },
    ]
  },
  {
    version: "1.0.0",
    date: "August 18-September 5, 2025",
    groups: [
      {
        category: "new",
        changes: [
          {
            description: "Initial release of MCP Assistant platform",
            subItems: [
              "Full-stack MCP Hub with Next.js 15 frontend and Django 5.2 backend",
              "Google OAuth authentication integration with NextAuth",
              "Dynamic MCP server connections with multiple transport types (stdio, SSE, WebSocket, HTTP)",
              "AI-powered chat using LangGraph agents with CopilotKit integration",
              "GraphQL API with Strawberry Django and advanced filtering",
              "Redis-based connection state management with 24-hour TTL",
              "Support for both authenticated and anonymous users",
              "Public and private MCP server configurations",
              "Real-time tool discovery and binding",
              "Server management UI with add, edit, delete, and enable/disable functionality",
              "Theme support with next-themes (light/dark mode)",
              "Responsive design with Tailwind CSS and shadcn/ui components",
              "Motion animations using Framer Motion"
            ]
          },
        ]
      },
    ]
  },
];

const categoryConfig = {
  new: {
    icon: Sparkles,
    label: "New",
    iconColor: "text-amber-400",
  },
  fixed: {
    icon: Wrench,
    label: "Fixed",
    iconColor: "text-blue-400",
  },
  improved: {
    icon: Zap,
    label: "Improved",
    iconColor: "text-purple-400",
  },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-3">Changelog</h1>
          <p className="text-muted-foreground text-lg">Product updates</p>
        </div>

        {/* Timeline Entries */}
        <div className="space-y-12">
          {changelog.map((entry, idx) => (
            <div key={entry.version} className="grid grid-cols-[200px_1fr] gap-8">
              {/* Left Side - Date & Version */}
              <div className="pt-1">
                <div className="flex items-center gap-2 text-primary font-medium mb-1">
                  <Clock className="h-4 w-4" />
                  <span>{entry.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">v{entry.version}</p>
              </div>

              {/* Right Side - Changes */}
              <div className="space-y-8">
                {entry.groups.map((group, groupIdx) => {
                  const config = categoryConfig[group.category];
                  const Icon = config.icon;

                  return (
                    <div key={groupIdx}>
                      {/* Category Header */}
                      <div className="flex items-center gap-2 mb-4">
                        <Icon className={`h-5 w-5 ${config.iconColor}`} />
                        <h3 className="text-lg font-semibold">{config.label}</h3>
                      </div>

                      {/* Changes List */}
                      <ul className="space-y-3">
                        {group.changes.map((change, changeIdx) => (
                          <li key={changeIdx}>
                            <div className="text-muted-foreground leading-relaxed">
                              • {change.description}
                            </div>
                            {change.subItems && (
                              <ul className="mt-2 ml-6 space-y-2">
                                {change.subItems.map((subItem, subIdx) => (
                                  <li key={subIdx} className="text-sm text-muted-foreground/80 leading-relaxed">
                                    ◦ {subItem}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
