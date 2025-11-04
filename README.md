# MCP Hub - Frontend

Next.js 15 frontend for the MCP (Model Context Protocol) Hub. Provides a modern web interface for managing and interacting with MCP servers.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, TypeScript, Tailwind CSS
- **Components:** shadcn/ui (Radix UI primitives)
- **Authentication:** NextAuth.js with Google OAuth
- **AI Chat:** CopilotKit integration
- **State:** React hooks, GraphQL queries

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000`
- Google OAuth credentials

### Installation

```bash
npm install
```

### Environment Variables

Create `.env.local` file:

```bash
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DJANGO_API_URL=http://localhost:8000
BACKEND_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
mcp-client/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (GraphQL proxy, CopilotKit)
│   ├── page.tsx           # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── AuthProvider.tsx  # NextAuth wrapper
├── hooks/                # Custom React hooks
│   └── useMcpServers.ts  # MCP server management
├── types/                # TypeScript types
│   └── mcp.ts           # MCP & Category types
└── lib/                  # Utilities
```

## Key Features

- **MCP Server Management** - Create, update, delete, and categorize servers
- **Category System** - Organize servers with icons and colors
- **Real-time Chat** - AI-powered chat with CopilotKit
- **Authentication** - Google OAuth integration
- **GraphQL API** - Type-safe queries and mutations
- **Responsive UI** - Mobile-friendly design

## API Integration

Frontend communicates with Django backend via:
- GraphQL endpoint: `/api/graphql`
- CopilotKit endpoints: `/api/copilotkit`

## TypeScript Types

Types are defined in `types/mcp.ts` and match the Django GraphQL schema:
- `McpServer` - Server configuration with category
- `Category` - Category with icon, color, description
- `ToolInfo` - MCP tool information

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org)
- [CopilotKit](https://docs.copilotkit.ai)
- [shadcn/ui](https://ui.shadcn.com)
