
import { useState } from "react";
import { Toaster } from "sonner";
import { DndContext } from "@dnd-kit/core";
import FormBuilder from "@/components/FormBuilder";
import Header from "@/components/Header";
import WelcomeModal from "@/components/WelcomeModal";
import { Button } from "@/components/ui/button";
import { SaveIcon, FileDown, FileUp, Settings } from "lucide-react";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [formName, setFormName] = useState("Untitled Form");

  const handleSaveForm = () => {
    // TODO: Implement form saving logic
    console.log("Saving form...");
  };

  const handleExportForm = () => {
    // TODO: Implement form export logic
    console.log("Exporting form...");
  };

  const handleImportForm = () => {
    // TODO: Implement form import logic
    console.log("Importing form...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex flex-col">
      <Toaster position="top-right" />
      
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      <Header />
      
      <div className="container mx-auto px-4 py-4 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-2">{formName}</h1>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="sr-only peer"
              id="form-name"
              aria-label="Form name"
            />
            <label
              htmlFor="form-name"
              className="cursor-pointer p-1 rounded-md hover:bg-muted"
              title="Edit form name"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </label>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleImportForm} className="w-full sm:w-auto">
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportForm} className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm" onClick={handleSaveForm} className="w-full sm:w-auto">
              <SaveIcon className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 pb-8 lg:px-8 flex-grow">
        <DndContext>
          <FormBuilder />
        </DndContext>
      </main>
      
      <footer className="border-t py-6 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Form Builder App © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
