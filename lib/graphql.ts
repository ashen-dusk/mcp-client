export const TOOL_INFO_FRAGMENT = `
  fragment ToolInfoFields on ToolInfo {
    name
    description
    schema
  }
`;

export const MCP_SERVER_FRAGMENT = `
  fragment McpServerFields on MCPServerType {
    id
    name
    transport
    url
    command
    args
    headers
    queryParams
    enabled
    requiresOauth2
    connectionStatus
    tools { ...ToolInfoFields }
    updatedAt
  }
  ${TOOL_INFO_FRAGMENT}
`;

export const MCP_SERVERS_QUERY = `
  query McpServers {
    mcpServers { ...McpServerFields }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const MCP_SERVER_HEALTH_QUERY = `
  query GetServerHealth($serverName: String!) {
    mcpServerHealth(name: $serverName) {
      status
      tools { ...ToolInfoFields }
    }
  }
  ${TOOL_INFO_FRAGMENT}
`;

export const CONNECT_MCP_SERVER_MUTATION = `
  mutation ConnectServer($serverName: String!) {
    connectMcpServer(name: $serverName) {
      success
      message
      tools { ...ToolInfoFields }
      serverName
      connectionStatus
    }
  }
  ${TOOL_INFO_FRAGMENT}
`;

export const DISCONNECT_MCP_SERVER_MUTATION = `
  mutation DisconnectServer($serverName: String!) {
    disconnectMcpServer(name: $serverName) {
      success
      message
    }
  }
`;

export const SET_MCP_SERVER_ENABLED_MUTATION = `
  mutation SetServerEnabled($serverName: String!, $enabled: Boolean!) {
    setMcpServerEnabled(name: $serverName, enabled: $enabled) {
      id
      name
      transport
      url
      command
      args
      headers
      queryParams
      enabled
      requiresOauth2
      connectionStatus
      tools { ...ToolInfoFields }
      updatedAt
    }
  }
  ${TOOL_INFO_FRAGMENT}
`;


