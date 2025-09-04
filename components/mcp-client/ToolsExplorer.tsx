"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Code, 
  Info, 
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { McpServer, ToolInfo } from "@/types/mcp";

interface ToolsExplorerProps {
  server: McpServer;
}

export default function ToolsExplorer({ server }: ToolsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'unavailable'>('all');

  const filteredTools = server.tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For now, all tools are considered "available" since we don't have status info
    const matchesFilter = filterStatus === 'all' || filterStatus === 'available';
    
    return matchesSearch && matchesFilter;
  });

  const toggleToolExpansion = (toolName: string) => {
    setExpandedTool(expandedTool === toolName ? null : toolName);
  };

  const parseSchema = (schema: any) => {
    // Schema is already a JSON object from Strawberry GraphQL
    if (typeof schema === 'object' && schema !== null) {
      return schema;
    }
    // Fallback for string schemas
    if (typeof schema === 'string') {
      try {
        return JSON.parse(schema);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getToolCategory = (toolName: string) => {
    // Simple categorization based on tool name patterns
    if (toolName.includes('search') || toolName.includes('find')) return 'Search';
    if (toolName.includes('create') || toolName.includes('add')) return 'Create';
    if (toolName.includes('update') || toolName.includes('edit')) return 'Update';
    if (toolName.includes('delete') || toolName.includes('remove')) return 'Delete';
    if (toolName.includes('get') || toolName.includes('fetch')) return 'Read';
    return 'General';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Search': return 'default';
      case 'Create': return 'default';
      case 'Update': return 'secondary';
      case 'Delete': return 'destructive';
      case 'Read': return 'outline';
      default: return 'secondary';
    }
  };

  if (!server.tools || server.tools.length === 0) {
    return (
      <div className="p-6">
        {/* <Card> */}
          <CardContent className="p-12 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tools Available</h3>
            <p className="text-muted-foreground">
              This server doesn't have any tools configured or they haven't been loaded yet.
            </p>
          </CardContent>
        {/* </Card> */}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h3 className="text-lg font-semibold">Tools Explorer</h3>
            <p className="text-sm text-muted-foreground">
              {filteredTools.length} of {server.tools.length} tools
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Tools
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('available')}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('unavailable')}>
                  Unavailable
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>

      {/* Tools Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredTools.map((tool, index) => {
              const category = getToolCategory(tool.name);
              const schema = parseSchema(tool.schema);
              
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-primary flex-shrink-0" />
                          <CardTitle className="text-sm truncate min-w-0 flex-1">{tool.name}</CardTitle>
                        </div>
                        <Badge variant={getCategoryColor(category)} className="text-xs w-fit">
                          {category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
                        {tool.description}
                      </p>
                      
                      {schema && (
                        <div className="space-y-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleToolExpansion(tool.name)}
                            className="w-full justify-start p-0 h-auto"
                          >
                            {expandedTool === tool.name ? (
                              <ChevronDown className="h-3 w-3 mr-1" />
                            ) : (
                              <ChevronRight className="h-3 w-3 mr-1" />
                            )}
                            <span className="text-xs">View Schema</span>
                          </Button>
                          
                          <AnimatePresence>
                            {expandedTool === tool.name && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-muted rounded-md p-3">
                                  <pre className="text-xs text-muted-foreground overflow-x-auto">
                                    {JSON.stringify(schema, null, 2)}
                                  </pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {filteredTools.map((tool, index) => {
              const category = getToolCategory(tool.name);
              const schema = parseSchema(tool.schema);
              
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Wrench className="h-4 w-4 text-primary" />
                            <h4 className="font-medium">{tool.name}</h4>
                            <Badge variant={getCategoryColor(category)} className="text-xs">
                              {category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {tool.description}
                          </p>
                          
                          {schema && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleToolExpansion(tool.name)}
                              className="p-0 h-auto"
                            >
                              {expandedTool === tool.name ? (
                                <ChevronDown className="h-3 w-3 mr-1" />
                              ) : (
                                <ChevronRight className="h-3 w-3 mr-1" />
                              )}
                              <span className="text-xs">View Schema</span>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedTool === tool.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-3"
                          >
                            <div className="bg-muted rounded-md p-3 max-w-full overflow-x-auto">
                              <pre className="text-xs text-muted-foreground whitespace-pre min-w-max">
                                {JSON.stringify(schema, null, 2)}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredTools.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tools Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
