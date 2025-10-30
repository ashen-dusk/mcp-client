import { ChevronDown, CheckCircle } from "lucide-react";
import React from "react";

export interface ModelDropdownProps {
  selectedModel: string;
  setShowModelDropdown: (open: boolean) => void;
  showModelDropdown: boolean;
  AVAILABLE_MODELS: any[];
  handleModelChange: (id: string) => void;
}

const ModelDropdown: React.FC<ModelDropdownProps> = ({
  selectedModel,
  setShowModelDropdown,
  showModelDropdown,
  AVAILABLE_MODELS,
  handleModelChange
}) => {
  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);
  return (
    <div className="relative mr-1 sm:mr-2">
      <button
        onClick={() => setShowModelDropdown(!showModelDropdown)}
        className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700/50 rounded transition-all duration-200"
      >
        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] sm:max-w-none">
          {selectedModelData?.name}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${showModelDropdown ? 'rotate-180' : ''}`} />
      </button>
      {showModelDropdown && (
        <>
          <div className="absolute bottom-full mb-2 right-0 md:right-0 left-0 md:left-auto bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-700/50 rounded-2xl shadow-2xl backdrop-blur-xl z-50 w-full md:min-w-[340px] md:max-w-[400px] max-h-[55vh] overflow-hidden">
            {/* Models List */}
            <div className="overflow-y-auto max-h-[55vh] scrollbar-minimal">
              <div className="p-2">
                {AVAILABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelChange(model.id)}
                    className={`w-full group relative flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all duration-150
                      ${selectedModel === model.id
                        ? 'bg-gray-100 dark:bg-zinc-800'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                      }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex items-center gap-2 flex-1">
                        <span className={`text-[11px] sm:text-xs font-medium ${selectedModel === model.id ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                          {model.name}
                        </span>
                        {/* Provider & Tag Badges */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                            {model.provider}
                          </span>
                          {model.id.includes(":free") && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                              OpenRouter
                            </span>
                          )}
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                            {model.tag}
                          </span>
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <CheckCircle className="w-4 h-4 text-gray-900 dark:text-white flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {model.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowModelDropdown(false)}
          />
        </>
      )}
    </div>
  );
};

export default ModelDropdown;
