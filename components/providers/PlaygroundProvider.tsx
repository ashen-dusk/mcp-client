"use client";
import { createContext, useContext, type PropsWithChildren } from "react";
import { useAssistants, type AssistantsState } from "@/hooks/useAssistants";

const PlaygroundContext = createContext<AssistantsState | undefined>(
  undefined
);

export function PlaygroundProvider({ children }: PropsWithChildren) {
  const assistantState = useAssistants();

  return (
    <PlaygroundContext.Provider value={assistantState}>
      {children}
    </PlaygroundContext.Provider>
  );
}

export function usePlayground() {
  const context = useContext(PlaygroundContext);
  if (context === undefined) {
    throw new Error(
      "usePlayground must be used within a PlaygroundProvider"
    );
  }
  return context;
}
