"use client";

import Link from "next/link";
import Image from "next/image";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/mcp";
import { CATEGORIES_QUERY } from "@/lib/graphql";

// GraphQL query for categories - imported from lib/graphql.ts
const GET_CATEGORIES = gql`${CATEGORIES_QUERY}`;

function CategoryItemSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

export default function Categories() {
  // Use Apollo Client to fetch categories directly with GraphQL
  const { loading, error, data } = useQuery(GET_CATEGORIES, {
    variables: {
      first: 8, // Show first 8 categories
    },
    fetchPolicy: "cache-and-network", // Always fetch fresh data while showing cached
  });

  // Extract nodes from edges structure
  const edges = data?.categories?.edges || [];
  const categories: Category[] = edges.map((edge: any) => edge.node);

  // Handle error state - hide section
  if (error) {
    console.error("Failed to load categories:", error);
    return null;
  }

  // Show only loading skeletons (no heading) while loading
  if (loading && categories.length === 0) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
          <CategoryItemSkeleton />
        </div>
      </div>
    );
  }

  // Hide section if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">
            Browse by Category
          </h2>
        </div>
        <Link
          href="/mcp"
          className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          View All <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/mcp?category=${encodeURIComponent(category.name)}`}>
            <div
              className="group flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105"
              style={{
                borderColor: category.color ? `${category.color}20` : undefined,
              }}
            >
              {/* Icon Container */}
              <div
                className="h-16 w-16 rounded-full flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: category.color ? `${category.color}15` : 'hsl(var(--primary) / 0.1)',
                  color: category.color || 'hsl(var(--primary))',
                }}
              >
                <Image
                  src={`/categories/${category.icon}.png`}
                  alt={category.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              {/* Category Name */}
              <h3 className="font-semibold text-base text-center group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Description */}
              {category.description && (
                <p className="text-xs text-muted-foreground text-center line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile View All Link */}
      <div className="md:hidden mt-6 text-center">
        <Link
          href="/mcp"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Browse All Categories <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
