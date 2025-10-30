"use client";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { Assistant } from "@/types/mcp";
import { MY_ASSISTANTS_QUERY, UPDATE_ASSISTANT_MUTATION, CREATE_ASSISTANT_MUTATION, DELETE_ASSISTANT_MUTATION } from "@/lib/graphql";

interface UseAssistantsReturn {
  assistants: Assistant[] | null;
  loading: boolean;
  error: string | null;
  activeAssistant: Assistant | null;
  refresh: () => Promise<void>;
  setActiveAssistant: (assistantId: string) => Promise<void>;
  createAssistant: (data: { name: string; instructions: string; description?: string; isActive?: boolean; config?: any }) => Promise<void>;
  updateAssistant: (id: string, data: { name?: string; instructions?: string; description?: string; isActive?: boolean; config?: any }) => Promise<void>;
  deleteAssistant: (id: string) => Promise<void>;
}

export function useAssistants(): UseAssistantsReturn {
  const [assistants, setAssistants] = useState<Assistant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch assistants from GraphQL API
  const fetchAssistants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: MY_ASSISTANTS_QUERY,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Failed to fetch assistants');
      }

      const assistants = result.data?.myAssistants || [];
      setAssistants(assistants);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch assistants';
      setError(errorMessage);
      // Don't show toast for auth errors - user might not be logged in
      if (!errorMessage.includes('authenticated')) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Set an assistant as active
  const setActiveAssistant = useCallback(async (assistantId: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_ASSISTANT_MUTATION,
          variables: {
            id: assistantId,
            isActive: true,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Failed to set active assistant');
      }

      // Refresh assistants list to update all is_active states
      await fetchAssistants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active assistant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchAssistants]);

  // Create a new assistant
  const createAssistant = useCallback(async (data: { name: string; instructions: string; description?: string; isActive?: boolean; config?: any }) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: CREATE_ASSISTANT_MUTATION,
          variables: {
            name: data.name,
            instructions: data.instructions,
            description: data.description || null,
            isActive: data.isActive || false,
            config: data.config || {},
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Failed to create assistant');
      }

      // Refresh assistants list
      await fetchAssistants();
      toast.success('Assistant created successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create assistant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchAssistants]);

  // Update an existing assistant
  const updateAssistant = useCallback(async (id: string, data: { name?: string; instructions?: string; description?: string; isActive?: boolean; config?: any }) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: UPDATE_ASSISTANT_MUTATION,
          variables: {
            id,
            ...data,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Failed to update assistant');
      }

      // Refresh assistants list
      await fetchAssistants();
      toast.success('Assistant updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update assistant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchAssistants]);

  // Delete an assistant
  const deleteAssistant = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: DELETE_ASSISTANT_MUTATION,
          variables: { id },
        }),
      });

      const result = await response.json();

      if (!response.ok || result.errors) {
        throw new Error(result.errors?.[0]?.message || 'Failed to delete assistant');
      }

      // Refresh assistants list
      await fetchAssistants();
      toast.success('Assistant deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete assistant';
      toast.error(errorMessage);
      throw err;
    }
  }, [fetchAssistants]);

  // Get the currently active assistant
  const activeAssistant = assistants?.find(a => a.isActive) || null;

  // Load assistants on mount
  useEffect(() => {
    fetchAssistants();
  }, [fetchAssistants]);

  return {
    assistants,
    loading,
    error,
    activeAssistant,
    refresh: fetchAssistants,
    setActiveAssistant,
    createAssistant,
    updateAssistant,
    deleteAssistant,
  };
}
