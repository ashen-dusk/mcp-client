export type ToolInfo = {
  name: string;
  description: string;
  schema: any; // JSON type from Strawberry
};

export type Category = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  description?: string | null;
  slug?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type McpServer = {
  id: string;
  name: string;
  description?: string | null;
  category?: Category | null;
  transport: string;
  owner?: string | null;
  url?: string | null;
  command?: string | null;
  args?: any | null;
  enabled: boolean;
  requiresOauth2: boolean;
  isPublic?: boolean;
  connectionStatus?: string | null;
  tools: ToolInfo[];
  updated_at: string;
  createdAt?: string;
};

export type ConnectionResult = {
  success: boolean;
  message: string;
  tools: ToolInfo[];
  server_name: string;
  connectionStatus: string;
  requiresAuth?: boolean;
  authorizationUrl?: string | null;
  state?: string | null;
};

export type DisconnectResult = {
  success: boolean;
  message: string;
};

export type ServerHealthInfo = {
  status: string;
  tools: ToolInfo[];
};

// Assistant Types
export type Assistant = {
  id: string;
  name: string;
  description?: string | null;
  instructions: string;
  isActive: boolean;
  config: any;
  createdAt: string;
  updatedAt: string;
};

// CopilotKit Agent Types
export type AgentState = {
  model: string;
  status?: string;
  sessionId: string;
  assistant?: Assistant | null;
};

export interface Tool {
  name: string;
  description: string;
}
