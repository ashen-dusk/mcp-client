import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Get the GraphQL API endpoint
const getGraphQLUri = () => {
  const baseUrl = process.env.NEXT_PUBLIC_DJANGO_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  return `${baseUrl.replace(/\/$/, '')}/api/graphql`;
};

// HTTP Link for GraphQL requests
const httpLink = new HttpLink({
  uri: getGraphQLUri(),
  credentials: 'same-origin',
});

// Auth link to add authorization header
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from session storage or wherever you store it
  // For NextAuth, we'll handle this in the provider
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('googleIdToken') : null;

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// Error link for centralized error handling
const errorLink = onError((errorResponse: unknown) => {
  const response = errorResponse as {
    graphQLErrors?: Array<{ message: string; locations?: unknown; path?: unknown }>;
    networkError?: Error;
  };

  if (response.graphQLErrors) {
    response.graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );
    });
  }

  if (response.networkError) {
    console.error(`[Network error]: ${response.networkError}`);
  }
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          mcpServers: {
            // Merge incoming data with existing data
            keyArgs: ['filters', 'order'],
            merge(existing = [], incoming) {
              return incoming;
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
