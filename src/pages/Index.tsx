import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import { DndContext } from "@dnd-kit/core";
import { useFormStore } from "@/stores/formStore";
import { useAuth } from "@/providers/AuthProvider";
import { exportAsJSON, importFromJSON } from "@/lib/form-io";
import { FormBuilder } from "@/components/FormBuilder";
import { Header } from "@/components/Header";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { 
  SaveIcon, 
  FileDown, 
  FileUp, 
  Pencil, 
  History,
  Share2,
  CloudUpload
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { FormNameEditor } from "@/components/FormNameEditor";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { UnsavedChangesDialog } from "@/components/UnsavedChangesDialog";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";

const Index = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { form, updateForm, saveForm, resetForm } = useFormStore();
  
  useBeforeUnload(hasUnsavedChanges);

  const handleSaveForm = useCallback(async () => {
    try {
      setIsLoading(true);
      await saveForm();
      toast.success("Form saved successfully");
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error("Failed to save form");
    } finally {
      setIsLoading(false);
    }
  }, [saveForm]);

  const handleExportForm = useCallback(async () => {
    try {
      setIsLoading(true);
      await exportAsJSON(form);
      toast.success("Form exported successfully");
    } catch (error) {
      toast.error("Failed to export form");
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  const handleImportForm = useCallback(async () => {
    try {
      const importedForm = await importFromJSON();
      updateForm(importedForm);
      toast.success("Form imported successfully");
      setHasUnsavedChanges(true);
    } catch (error) {
      toast.error("Failed to import form");
    }
  }, [updateForm]);

  const handleNameChange = useCallback((newName: string) => {
    updateForm({ name: newName });
    setHasUnsavedChanges(true);
  }, [updateForm]);

  useEffect(() => {
    if (user?.recentForms?.length > 0) {
      setShowWelcome(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex flex-col">
      <Toaster position="top-right" richColors />
      <LoadingOverlay visible={isLoading} />
      
      {showWelcome && (
        <WelcomeModal 
          onClose={() => setShowWelcome(false)}
          onNewForm={resetForm}
          onImportForm={handleImportForm}
        />
      )}
      
      <UnsavedChangesDialog
        when={hasUnsavedChanges}
        onConfirm={handleSaveForm}
        onCancel={resetForm}
      />
      
      <Header />
      
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FormNameEditor
              name={form.name}
              onChange={handleNameChange}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowWelcome(true)}
                >
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Version History</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleImportForm}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import JSON form definition</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleExportForm}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as JSON</TooltipContent>
            </Tooltip>

            <Button onClick={handleSaveForm}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collaborate in real-time</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 pb-8 lg:px-8 flex-grow">
        <DndContext autoScroll={{ threshold: { x: 0.1, y: 0.1 } }}>
          <FormBuilder 
            onFormChange={() => setHasUnsavedChanges(true)}
          />
        </DndContext>
      </main>
      
      <footer className="border-t py-6 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>Form Builder v1.2.0</span>
            {user && (
              <span className="flex items-center gap-2">
                <CloudUpload className="h-4 w-4" />
                Auto-save {form.autoSave ? "enabled" : "disabled"}
              </span>
            )}
          </div>
          <p>© {new Date().getFullYear()} Form Factory - MIT License</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
