
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Save, 
  Settings, 
  Moon, 
  Sun, 
  FileCode, 
  Share2 
} from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

const Header = () => {
  const [projectName, setProjectName] = useState("My Form Project");
  
  const handleSave = () => {
    // Implement save functionality
    toast.success("Project saved successfully!");
  };
  
  const handleExport = (format: string) => {
    // Implement export functionality
    toast.success(`Project exported as ${format} successfully!`);
  };
  
  const handleShareProject = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success("Project link copied to clipboard!");
  };

  return (
    <header className="border-b backdrop-blur-sm bg-background/90 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-primary">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                FormCraft
              </span>
            </div>
            
            <div className="h-6 w-px bg-border mx-1"></div>
            
            <div className="relative">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="h-9 rounded-md border border-input px-3 py-1 text-sm bg-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleSave}>
                    <Save className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save Project</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Download className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExport("HTML")}>
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>Export as HTML</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("JSON")}>
                        <FileCode className="mr-2 h-4 w-4" />
                        <span>Export as JSON</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>Export</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleShareProject}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share Project</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <ModeToggle />
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
