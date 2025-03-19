
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Save, Download, UploadCloud, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { toast } from "sonner";

const Header = () => {
  const [projectName, setProjectName] = useState("My Form");

  const handleSave = () => {
    toast.success("Form saved successfully!");
  };

  const handleExport = () => {
    toast.success("Form exported successfully!");
  };

  const handleImport = () => {
    toast.info("Import feature coming soon!");
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              Form Builder
            </h1>
            <div className="h-6 w-px bg-border mx-2" />
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm font-medium"
            />
          </div>

          <TooltipProvider>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                    <span className="sr-only">Save</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save form</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export form</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleImport}>
                    <UploadCloud className="h-4 w-4" />
                    <span className="sr-only">Import</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Import form</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>
              
              <div className="h-6 w-px bg-border mx-1" />
              <ModeToggle />
            </div>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
