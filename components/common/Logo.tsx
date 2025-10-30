"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return (
      <div className="w-10 h-10 bg-muted animate-pulse rounded" />
    );
  }

  return (
    <Image 
      src={resolvedTheme === 'dark' ? "/images/logo-dark.png" : "/images/logo-light.png"} 
      alt="MCP Platform" 
      width={40} 
      height={40} 
    />
  );
}
