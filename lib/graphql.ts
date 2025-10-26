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
    enabled
    description
    requiresOauth2
    connectionStatus
    tools { ...ToolInfoFields }
    updatedAt
    createdAt
    owner
    isPublic
  }
  ${TOOL_INFO_FRAGMENT}
`;

export const MCP_SERVERS_QUERY = `
  query McpServers {
    mcpServers { ...McpServerFields }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const CONNECT_MCP_SERVER_MUTATION = `
  mutation ConnectServer($serverName: String!) {
    connectMcpServer(name: $serverName) {
      success
      message
      connectionStatus
      requiresAuth
      authorizationUrl
      state
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const DISCONNECT_MCP_SERVER_MUTATION = `
  mutation DisconnectServer($serverName: String!) {
    disconnectMcpServer(name: $serverName) {
      success
      message
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const SET_MCP_SERVER_ENABLED_MUTATION = `
  mutation SetServerEnabled($serverName: String!, $enabled: Boolean!) {
    setMcpServerEnabled(name: $serverName, enabled: $enabled) {
     ...McpServerFields
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const SAVE_MCP_SERVER_MUTATION = `
  mutation SaveMcpServer(
    $name: String!
    $transport: String!
    $url: String
    $command: String
    $args: JSON
    $headers: JSON
    $queryParams: JSON
    $requiresOauth2: Boolean
    $isPublic: Boolean
    $description: String
  ) {
    saveMcpServer(
      name: $name
      transport: $transport
      url: $url
      command: $command
      args: $args
      headers: $headers
      queryParams: $queryParams
      requiresOauth2: $requiresOauth2
      isPublic: $isPublic
      description: $description
    ) {
    id
    name
    description
    transport
    url
    command
    args
    enabled
    requiresOauth2
    connectionStatus
    updatedAt
    createdAt
    owner
    isPublic
    }
  }
`;

export const REMOVE_MCP_SERVER_MUTATION = `
  mutation RemoveMcpServer($serverName: String!) {
    removeMcpServer(name: $serverName)
  }
`;

export const RESTART_MCP_SERVER_MUTATION = `
  mutation RestartMcpServer($name: String!) {
    restartMcpServer(name: $name) {
      success
      message
      connectionStatus
      requiresAuth
      authorizationUrl
      state
      server { ...McpServerFields }
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;

export const USER_MCP_SERVERS_QUERY = `
  query GetUserMcpServers {
    getUserMcpServers {
      ...McpServerFields
    }
  }
  ${MCP_SERVER_FRAGMENT}
`;


