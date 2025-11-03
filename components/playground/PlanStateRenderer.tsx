"use client";

import { useCoAgentStateRender } from "@copilotkit/react-core";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

interface PlanStep {
  step_number: number;
  description: string;
  expected_outcome: string;
  status: string;
  dependencies?: number[];
  result?: string;
  error?: string;
  is_current?: boolean;
}

interface PlanState {
  mode: string;
  status: string;
  plan?: {
    objective: string;
    summary: string;
    created_at?: string;
    updated_at?: string;
  };
  progress?: {
    total_steps: number;
    completed: number;
    failed: number;
    in_progress: number;
    pending: number;
    current_step_index: number;
    percentage: number;
  };
  steps?: PlanStep[];
  execution_history?: Array<{
    step_number: number;
    description: string;
    result: string;
    completed_at: string;
    tools_used: string[];
  }>;
}

const getStepIcon = (status: string, isCurrent: boolean) => {
  if (isCurrent && status === "in_progress") {
    return <Loader2 className="w-5 h-5 text-foreground animate-spin" />;
  }

  switch (status) {
    case "completed":
      return <CheckCircle2 className="w-5 h-5 text-foreground" />;
    case "failed":
      return <XCircle className="w-5 h-5 text-destructive" />;
    case "in_progress":
      return <Loader2 className="w-5 h-5 text-foreground animate-spin" />;
    case "pending":
      return <Circle className="w-5 h-5 text-muted-foreground" />;
    default:
      return <Circle className="w-5 h-5 text-muted-foreground" />;
  }
};

const PlanStepItem = ({ step, showConnector }: { step: PlanStep; showConnector: boolean }) => {
  const isCurrent = step.is_current || step.status === "in_progress";

  return (
    <div className="relative">
      {/* Connector line */}
      {showConnector && (
        <div className="absolute left-[10px] top-[28px] w-0.5 h-[calc(100%)] bg-muted" />
      )}

      <div className="flex gap-3">
        {/* Step icon */}
        <div className="flex-shrink-0 relative z-10 bg-background">
          {getStepIcon(step.status, isCurrent)}
        </div>

        {/* Step content */}
        <div className="flex-1 min-w-0 pb-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium">
              {step.description}
            </p>
            {isCurrent && (
              <div className="flex-shrink-0">
                <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
              </div>
            )}
          </div>

          {/* Show result if completed */}
          {step.status === "completed" && step.result && (
            <p className="mt-1 text-xs text-muted-foreground">
              {step.result.substring(0, 100)}
              {step.result.length > 100 && "..."}
            </p>
          )}

          {/* Show error if failed */}
          {step.status === "failed" && step.error && (
            <p className="mt-1 text-xs text-destructive">
              Error: {step.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const PlanStateRenderer = () => {
  useCoAgentStateRender({
    name: "mcpAssistant",
    render: ({ state, status }) => {
      // Extract plan_state from the agent state
      const planState = (state as any)?.plan_state as PlanState;

      // Only render if we're in plan mode and have a plan
      if (!planState || planState.mode !== "plan" || !planState.plan) {
        return null;
      }

      const { plan, progress, steps } = planState;

      return (
        <div className="mb-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <Loader2 className="w-4 h-4 text-foreground animate-spin" /> */}
                {/* <div> */}
                  <h3 className="text-sm font-medium">Executing Plan</h3>
                  <p className="text-xs text-muted-foreground">{plan.objective}</p>
                {/* </div> */}
              </div>
              {progress && (
                <div className="text-xs text-muted-foreground">
                  {progress.completed}/{progress.total_steps}
                </div>
              )}
            </div>

            {/* Progress bar */}
            {progress && (
              <div className="mt-3">
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all duration-500 ease-out"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Steps list */}
          <div className="space-y-0">
            {steps && steps.length > 0 ? (
              steps.map((step, index) => (
                <PlanStepItem
                  key={step.step_number}
                  step={step}
                  showConnector={index < steps.length - 1}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No steps available</p>
            )}
          </div>
        </div>
      );
    },
  });

  return null;
};
