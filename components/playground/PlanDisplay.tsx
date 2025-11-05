"use client";
import { useCoAgentStateRender } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface PlanState {
  plan?: string[];
  past_steps?: Array<[string, string]>;
  response?: string;
}

export function PlanDisplay() {
  useCoAgentStateRender<PlanState>({
    name: "mcpAssistant",
    render: ({ state, status }) => {
      // If there's no plan or past_steps, don't render anything
      if (!state?.plan && !state?.past_steps) {
        return null;
      }

      const plan = state.plan || [];
      const pastSteps = state.past_steps || [];
      const totalSteps = pastSteps.length + plan.length;
      const completedCount = pastSteps.length;
      const progress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

      return (
        <Card className="mb-4 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {status === "inProgress" && <Loader2 className="h-4 w-4 animate-spin" />}
                Plan Progress
              </CardTitle>
              <Badge variant="secondary">
                {completedCount} / {totalSteps} steps
              </Badge>
            </div>
            {/* Progress Bar */}
            <div className="mt-2">
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Completed Steps */}
            {pastSteps.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Completed Steps
                </h4>
                <div className="space-y-2">
                  {pastSteps.map(([step, result], index) => (
                    <div
                      key={`completed-${index}`}
                      className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{step}</p>
                          {result && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {result}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remaining Steps */}
            {plan.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Circle className="h-4 w-4" />
                  Remaining Steps
                </h4>
                <div className="space-y-2">
                  {plan.map((step, index) => (
                    <div
                      key={`remaining-${index}`}
                      className="p-3 rounded-lg bg-secondary border border-border"
                    >
                      <div className="flex items-start gap-2">
                        <Circle
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            index === 0
                              ? "text-primary animate-pulse"
                              : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground">
                            {index === 0 && (
                              <Badge variant="outline" className="mr-2 text-xs">
                                Current
                              </Badge>
                            )}
                            {step}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Response */}
            {state.response && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  ✓ Task Complete
                </h4>
                <p className="text-sm text-foreground">{state.response}</p>
              </div>
            )}
          </CardContent>
        </Card>
      );
    },
  });

  return null;
}
