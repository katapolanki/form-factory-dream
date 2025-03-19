import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  Save, 
  Download, 
  UploadCloud, 
  Settings, 
  History,
  Share2,
  GitBranch,
  Cloud,
  CloudOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useFormDesigner } from "@/hooks/use-form-designer";
import { ProjectNameInput } from "./ProjectNameInput";
import { CollaborationMenu } from "./CollaborationMenu";
import { ExportMenu } from "./ExportMenu";
import { useAutoSave } from "@/hooks/use-auto-save";

const Header = () => {
  const { project, isDirty, isSaving, actions } = useFormDesigner();
  const [isOnline, setIsOnline] = useState(true);
  const { startAutoSave, stopAutoSave } = useAutoSave();

  useEffect(() => {
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));
    return () => {
      window.removeEventListener("online", () => setIsOnline(true));
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  return (
    <header className="border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <ProjectNameInput
              value={project.name}
              onChange={actions.setProjectName}
            />
            <div className="flex items-center gap-2">
              {!isOnline && (
                <Tooltip>
                  <TooltipTrigger>
                    <CloudOff className="h-5 w-5 text-destructive" />
                  </TooltipTrigger>
                  <TooltipContent>Offline mode - changes saved locally</TooltipContent>
                </Tooltip>
              )}
              {isSaving && (
                <span className="text-sm text-muted-foreground">
                  Saving...
                </span>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <CollaborationMenu
              projectId={project.id}
              onShare={actions.shareProject}
            />

            <ExportMenu
              onExport={actions.exportProject}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <History className="mr-2 h-4 w-4" />
                  Version History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <GitBranch className="mr-2 h-4 w-4" />
                  Branches
                </DropdownMenuItem>
                <DropdownMenuItem onClick={startAutoSave}>
                  <Cloud className="mr-2 h-4 w-4" />
                  Auto-save {project.autoSave ? "✓" : ""}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
