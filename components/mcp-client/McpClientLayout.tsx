"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Settings, Wrench, Activity, PanelLeftClose, PanelLeftOpen, Plus, Edit, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import ServerFormModal from "./ServerFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { McpServer } from "@/types/mcp";
import ServerManagement from "./ServerManagement";
import ToolsExplorer from "./ToolsExplorer";

interface McpClientLayoutProps {
  servers: McpServer[] | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onServerAction: (serverName: string, action: 'restart' | 'activate' | 'deactivate') => Promise<void>;
  onServerAdd: (data: any) => Promise<void>;
  onServerUpdate: (data: any) => Promise<void>;
  onServerDelete: (serverName: string) => Promise<void>;
}

export default function McpClientLayout({ 
  servers, 
  loading, 
  error, 
  onRefresh, 
  onServerAction,
  onServerAdd,
  onServerUpdate,
  onServerDelete
}: McpClientLayoutProps) {
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingServer, setEditingServer] = useState<McpServer | null>(null);

  // Update selected server when servers list changes
  useEffect(() => {
    if (selectedServer && servers) {
      const updatedServer = servers.find(server => server.name === selectedServer.name);
      if (updatedServer) {
        setSelectedServer(updatedServer);
      }
    }
  }, [servers, selectedServer]);

  const handleAddServer = () => {
    setModalMode('add');
    setEditingServer(null);
    setModalOpen(true);
  };

  const handleEditServer = (server: McpServer) => {
    setModalMode('edit');
    setEditingServer(server);
    setModalOpen(true);
  };

  const handleDeleteServer = async (serverName: string) => {
    if (confirm(`Are you sure you want to delete "${serverName}"?`)) {
      try {
        await onServerDelete(serverName);
        if (selectedServer?.name === serverName) {
          setSelectedServer(null);
        }
      } catch (error) {
        console.error('Failed to delete server:', error);
      }
    }
  };

  const handleModalSubmit = async (data: any) => {
    if (modalMode === 'add') {
      await onServerAdd(data);
    } else {
      await onServerUpdate(data);
    }
  };

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -320, opacity: 0 }
  };

  const mainVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const getStatusColor = (status: string | null | undefined, enabled: boolean) => {
    if (!enabled) return "secondary";
    if (!status) return "outline";
    switch (status.toLowerCase()) {
      case "connected":
        return "default";
      case "disconnected":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string | null | undefined, enabled: boolean) => {
    if (!enabled) return <Settings className="h-3 w-3" />;
    if (!status) return <Server className="h-3 w-3" />;
    switch (status.toLowerCase()) {
      case "connected":
        return <Activity className="h-3 w-3" />;
      case "disconnected":
        return <Settings className="h-3 w-3" />;
      case "failed":
        return <Settings className="h-3 w-3" />;
      default:
        return <Server className="h-3 w-3" />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onRefresh} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
      <div className="flex h-screen">
        {/* Left Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={sidebarVariants}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-80 border-r border-border bg-card flex flex-col"
            >
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-semibold">MCP Client</h1>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddServer}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-1"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Manage your MCP servers and explore tools
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">Servers</h2>
                <Button
                  onClick={() => {
                    onRefresh();
                    toast.success("Refreshing servers...");
                  }}
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <Activity className="h-4 w-4 animate-spin" />
                  ) : (
                    <Settings className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Separator />

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : servers && servers.length > 0 ? (
                <div className="space-y-2">
                  {servers.map((server) => (
                    <motion.div
                      key={server.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md group relative ${
                          selectedServer?.name === server.name
                            ? "ring-2 ring-primary"
                            : ""
                        }`}
                        onClick={() => setSelectedServer(server)}
                      >
                        <CardContent className="px-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Server className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium text-sm">
                                {server.name}
                              </span>
                            </div>
                            <div 
                              className={`w-2 h-2 rounded-full ${
                                !server.enabled 
                                  ? "bg-gray-400" 
                                  : server.connectionStatus?.toLowerCase() === "connected"
                                  ? "bg-green-500"
                                  : server.connectionStatus?.toLowerCase() === "disconnected"
                                  ? "bg-yellow-500"
                                  : server.connectionStatus?.toLowerCase() === "failed"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div>{server.transport} • {server.tools.length} tools</div>
                          </div>
                          
                          {/* Hover Action Buttons - Left Side */}
                          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditServer(server);
                              }}
                              className="h-6 w-6 p-0 bg-background/80 hover:bg-background shadow-sm"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteServer(server.name);
                              }}
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive bg-background/80 hover:bg-background shadow-sm"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Server className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No servers found
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={mainVariants}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          {/* Show Sidebar Button - Only when sidebar is closed */}
          {!sidebarOpen && (
            <div className="p-4 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-2"
              >
                <PanelLeftOpen className="h-4 w-4" />
                Show Sidebar
              </Button>
            </div>
          )}
          <AnimatePresence mode="wait">
            {selectedServer ? (
              <motion.div
                key={selectedServer.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col"
              >
                <div className="p-4 sm:p-6 border-b border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-semibold">{selectedServer.name}</h2>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedServer.transport} • {selectedServer.connectionStatus || "Unknown"}
                      </p>
                      
                      {/* Compact Server Details */}
                      <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                        {selectedServer.id && (
                          <span className="flex items-center">
                            <span className="font-medium">ID</span> 
                            <code className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs">{selectedServer.id}</code>
                          </span>
                        )}
                        {selectedServer.url && (
                          <span className="flex items-center">
                            <span className="font-medium">URL</span> 
                            <code className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs max-w-48 truncate">{selectedServer.url}</code>
                          </span>
                        )}
                        {selectedServer.command && (
                          <span className="flex items-center">
                            <span className="font-medium">CMD:</span> 
                            <code className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs">{selectedServer.command}</code>
                          </span>
                        )}
                      </div>
                    </div>
                    <ServerManagement
                      server={selectedServer}
                      onAction={onServerAction}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ToolsExplorer server={selectedServer} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex items-center justify-center"
              >
                <div className="text-center">
                  <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a Server</h3>
                  <p className="text-muted-foreground">
                    Choose a server from the sidebar to view its tools and manage it
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Server Form Modal */}
      <ServerFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        server={editingServer}
        mode={modalMode}
      />
    </div>
  );
}
