import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import React from "react";

interface AssistantDeleteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  assistant?: { name?: string } | null;
  loading: boolean;
  onDelete: () => void;
  onCancel: () => void;
}

const AssistantDeleteDialog: React.FC<AssistantDeleteDialogProps> = ({ open, onOpenChange, assistant, loading, onDelete, onCancel }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/20">
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-base">Delete Assistant</DialogTitle>
        </div>
        <DialogDescription className="text-sm leading-relaxed">
          Are you sure you want to delete <strong>{assistant?.name}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex-row gap-2 sm:gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={onDelete}
          disabled={loading}
          className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default AssistantDeleteDialog;
