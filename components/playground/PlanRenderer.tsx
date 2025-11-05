"use client";
import { useCoAgentStateRender, useLangGraphInterrupt } from "@copilotkit/react-core";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Loader2, AlertCircle } from "lucide-react";

interface PlanState {
  plan?: string[];
  past_steps?: Array<[string, string]>;
  response?: string;
}

interface StepApprovalData {
  type?: string;
  step_number?: number;
  total_steps?: number;
  step_description?: string;
  message?: string;
}

export function PlanRenderer() {
  // ============================================================================
  // Human-in-the-Loop Approval (COMMENTED OUT)
  // ============================================================================
  // Handle step approval interrupts - render approval UI above plan
  // useLangGraphInterrupt({
  //   enabled: ({ eventValue }: { eventValue?: StepApprovalData }) =>
  //     eventValue?.type === "step_approval_request",
  //   render: ({ event, resolve }) => {
  //     const stepData = (event?.value || {}) as StepApprovalData;
  //     const stepNumber = stepData?.step_number || 0;
  //     const totalSteps = stepData?.total_steps || 0;
  //     const stepDescription = stepData?.step_description || "";
  //
  //     return (
  //       <div className="mb-4 bg-gray-50 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
  //         <div className="flex items-start gap-3">
  //           <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
  //           <div className="flex-1">
  //             <p className="text-sm font-semibold mb-1">Approval Required</p>
  //             <p className="text-xs text-gray-600 mb-1">
  //               Step {stepNumber} of {totalSteps}
  //             </p>
  //             <p className="text-sm text-black mb-3">{stepDescription}</p>
  //             <div className="flex gap-2">
  //               <Button
  //                 size="sm"
  //                 variant="outline"
  //                 onClick={() => {
  //                   resolve?.(JSON.stringify({ approved: false, action: "CANCEL" }));
  //                 }}
  //                 className="text-xs h-7 cursor-pointer"
  //               >
  //                 Cancel
  //               </Button>
  //               <Button
  //                 size="sm"
  //                 onClick={() => {
  //                   resolve?.(JSON.stringify({ approved: true, action: "CONTINUE" }));
  //                 }}
  //                 className="text-xs h-7 bg-black text-white hover:bg-gray-800 cursor-pointer"
  //               >
  //                 Approve & Continue
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   },
  // });

  // Render plan state
  useCoAgentStateRender<PlanState>({
    name: "mcpAssistant",
    render: ({ state }) => {
      // If there's no plan or past_steps, don't render anything
      if (!state?.plan && !state?.past_steps) {
        return null;
      }

      const plan = state.plan || [];
      const pastSteps = state.past_steps || [];
      const totalSteps = pastSteps.length + plan.length;
      const completedCount = pastSteps.length;
      const currentStepIndex = completedCount;

      // Combine all steps for unified display
      const allSteps = [
        ...pastSteps.map(([step, result], index) => ({
          description: step,
          result,
          status: "completed" as const,
          index,
        })),
        ...plan.map((step, index) => ({
          description: step,
          result: null,
          status: index === 0 ? ("current" as const) : ("pending" as const),
          index: completedCount + index,
        })),
      ];

      return (
        <div className="mb-6 bg-white rounded-lg">
          {/* Header */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Plan</h3>
              <span className="text-xs text-gray-600">
                {completedCount} / {totalSteps}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{
                  width: `${totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div>
            {allSteps.map((step) => (
              <div key={step.index} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {step.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    {step.status === "current" && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    {step.status === "pending" && (
                      <Circle className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        step.status === "completed"
                          ? "text-gray-600"
                          : "text-black font-medium"
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Result for completed steps */}
                    {step.result && step.status === "completed" && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {step.result}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final Response */}
          {state.response && (
            <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
              <p className="text-xs font-semibold text-black mb-1">✓ Complete</p>
              <p className="text-sm text-gray-700">{state.response}</p>
            </div>
          )}
        </div>
      );
    },
  });

  return null;
}
