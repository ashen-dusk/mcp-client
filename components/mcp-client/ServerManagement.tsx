"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Power, 
  RotateCcw, 
  Play, 
  Pause, 
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { McpServer } from "@/types/mcp";

interface ServerManagementProps {
  server: McpServer;
  onAction: (serverName: string, action: 'restart' | 'activate' | 'deactivate') => Promise<void>;
}

export default function ServerManagement({ server, onAction }: ServerManagementProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: 'restart' | 'activate' | 'deactivate') => {
    setLoading(action);
    
    try {
      await onAction(server.name, action);
      toast.success(`Server ${action}d successfully`);
    } catch (error) {
      console.error(`Failed to ${action} server:`, error);
      toast.error(`Failed to ${action} server`);
    } finally {
      setLoading(null);
    }
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
    if (!enabled) return <Pause className="h-3 w-3" />;
    if (!status) return <Power className="h-3 w-3" />;
    switch (status.toLowerCase()) {
      case "connected":
        return <CheckCircle className="h-3 w-3" />;
      case "disconnected":
        return <XCircle className="h-3 w-3" />;
      case "failed":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Power className="h-3 w-3" />;
    }
  };

  const isActionDisabled = (action: string) => {
    if (loading) return true;
    
    switch (action) {
      case 'activate':
        return server.enabled;
      case 'deactivate':
        return !server.enabled;
      default:
        return false;
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Badge */}
      <div className="flex items-center gap-2">
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
        <Badge
          variant={getStatusColor(server.connectionStatus, server.enabled)}
          className="flex items-center gap-1"
        >
          {getStatusIcon(server.connectionStatus, server.enabled)}
          <span>
            {server.enabled ? (server.connectionStatus || "Unknown") : "Disabled"}
          </span>
        </Badge>
      </div>


      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Primary Action Button */}
        {server.enabled ? (
          <Button
            onClick={() => handleAction('restart')}
            disabled={isActionDisabled('restart')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {loading === 'restart' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Restart
          </Button>
        ) : (
          <Button
            onClick={() => handleAction('activate')}
            disabled={isActionDisabled('activate')}
            size="sm"
            className="flex items-center gap-2"
          >
            {loading === 'activate' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            Activate
          </Button>
        )}

        {/* Dropdown Menu for Additional Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={loading !== null}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {server.enabled ? (
              <DropdownMenuItem
                onClick={() => handleAction('deactivate')}
                disabled={isActionDisabled('deactivate')}
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => handleAction('activate')}
                disabled={isActionDisabled('activate')}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => handleAction('restart')}
              disabled={isActionDisabled('restart')}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
