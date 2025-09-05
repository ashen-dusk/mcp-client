export type ToolInfo = {
  name: string;
  description: string;
  schema: any; // JSON type from Strawberry
};

export type McpServer = {
  id: string;
  name: string;
  transport: string;
  url?: string | null;
  command?: string | null;
  args?: any | null; // JSON type from Strawberry
  enabled: boolean;
  requiresOauth2: boolean;
  isPublic?: boolean;
  connectionStatus?: string | null;
  tools: ToolInfo[];
  updated_at: string; // datetime as ISO string
};

export type ConnectionResult = {
  success: boolean;
  message: string;
  tools: ToolInfo[];
  server_name: string;
  connectionStatus: string;
};

export type DisconnectResult = {
  success: boolean;
  message: string;
};

export type ServerHealthInfo = {
  status: string;
  tools: ToolInfo[];
};
