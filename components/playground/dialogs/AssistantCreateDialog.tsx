import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Bot, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import React from "react";
import type { AssistantFormData } from "./AssistantEditDialog";

interface AssistantCreateDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: AssistantFormData;
  setFormData: (v: AssistantFormData) => void;
  onCreate: () => void;
  loading: boolean;
  handleCancel: () => void;
}

const AssistantCreateDialog: React.FC<AssistantCreateDialogProps> = ({ open, onOpenChange, formData, setFormData, onCreate, loading, handleCancel }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800">
            <Bot className="h-4 w-4 text-gray-900 dark:text-white" />
          </div>
          <DialogTitle className="text-base">Create New Assistant</DialogTitle>
        </div>
        <DialogDescription className="text-sm leading-relaxed">
          Create a custom assistant with specific instructions to personalize your experience.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4 overflow-y-auto flex-1 scrollbar-minimal">
        <div className="space-y-2">
          <Label htmlFor="assistant-name">Name *</Label>
          <Input
            id="assistant-name"
            placeholder="My Assistant"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assistant-description">Description</Label>
          <Input
            id="assistant-description"
            placeholder="Brief description of the assistant"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="assistant-instructions">Instructions *</Label>
          <Textarea
            id="assistant-instructions"
            placeholder="You are a helpful assistant that..."
            value={formData.instructions}
            onChange={e => setFormData({ ...formData, instructions: e.target.value })}
            rows={5}
          />
        </div>
        {/* Config Section */}
        <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-zinc-700">
          <Label className="text-sm font-semibold">Configuration</Label>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1 pr-4">
              <Label htmlFor="ask-mode" className="text-sm font-normal">Ask Mode</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Agent will ask to approve before executing tools/performing actions</p>
            </div>
            <Switch
              id="ask-mode"
              checked={formData.config.ask_mode}
              onCheckedChange={checked => setFormData({ ...formData, config: { ...formData.config, ask_mode: checked } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="datetime-context" className="text-sm font-normal">DateTime Context</Label>
              <p className="text-xs text-gray-500 dark:text-gray-400">Include date and time information</p>
            </div>
            <Switch
              id="datetime-context"
              checked={formData.config.datetime_context}
              onCheckedChange={checked => setFormData({ ...formData, config: { ...formData.config, datetime_context: checked } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              min={100}
              max={10000}
              step={100}
              value={formData.config.max_tokens}
              onChange={e => setFormData({ ...formData, config: { ...formData.config, max_tokens: parseInt(e.target.value) || 2000 } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <div className="flex items-center gap-3">
              <Input
                id="temperature"
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={formData.config.temperature}
                onChange={e => setFormData({ ...formData, config: { ...formData.config, temperature: parseFloat(e.target.value) || 0.7 } })}
                className="flex-1"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">
                {formData.config.temperature}
              </span>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter className="flex-row gap-2 sm:gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={onCreate}
          disabled={loading}
          className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Assistant"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AssistantCreateDialog;
