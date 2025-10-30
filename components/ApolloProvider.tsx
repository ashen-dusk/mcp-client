"use client";

import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { ApolloProvider as ApolloProviderBase } from '@apollo/client/react';

// Get the GraphQL API endpoint
const getGraphQLUri = () => {
  const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return `${baseUrl.replace(/\/$/, '')}/api/graphql`;
};

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const client = useMemo(() => {
    // HTTP Link for GraphQL requests
    const httpLink = new HttpLink({
      uri: getGraphQLUri(),
      credentials: 'same-origin',
    });

    // Auth link to add authorization header
    const authLink = new ApolloLink((operation, forward) => {
      const token = (session as { googleIdToken?: string } | null)?.googleIdToken;

      operation.setContext(({ headers = {} }) => ({
        headers: {
          ...headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        }
      }));

      return forward(operation);
    });

    // Error link for centralized error handling
    const errorLink = new ApolloLink((operation, forward) => {
      return forward(operation);
    });

    // Create Apollo Client
    return new ApolloClient({
      link: ApolloLink.from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              mcpServers: {
                // Cursor-based pagination handling
                keyArgs: ['filters', 'order'],
                merge(existing, incoming, { args }) {
                  if (!existing) return incoming;

                  // If no "after" cursor, it's a fresh query - replace existing
                  if (!args?.after) {
                    return incoming;
                  }

                  // Otherwise, append new edges to existing (infinite scroll)
                  return {
                    ...incoming,
                    edges: [...existing.edges, ...incoming.edges],
                  };
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [session]);

  // Note: No need to manually clear store when session changes
  // The client is already recreated via useMemo when session changes,
  // and the old cache will be garbage collected

  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
}
