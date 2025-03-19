
import { useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WelcomeModalProps {
  onClose: () => void;
}

const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Form Builder</DialogTitle>
          <DialogDescription>
            Create beautiful forms with an intuitive drag and drop interface
          </DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <Tabs defaultValue="getting-started">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="tips">Pro Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started" className="space-y-4 mt-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">1. Drag & Drop Components</h3>
              <p className="text-sm text-muted-foreground">
                Select components from the left panel and drag them onto the canvas.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">2. Configure Properties</h3>
              <p className="text-sm text-muted-foreground">
                Click on any element to edit its properties in the right panel.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">3. Preview & Export</h3>
              <p className="text-sm text-muted-foreground">
                Use the preview button to see how your form will look and function.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer">
              <h3 className="font-medium mb-2">Contact Form</h3>
              <p className="text-sm text-muted-foreground">
                Name, email, subject and message fields with validation.
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer">
              <h3 className="font-medium mb-2">Survey</h3>
              <p className="text-sm text-muted-foreground">
                Multiple choice questions with rating scales and text areas.
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer">
              <h3 className="font-medium mb-2">Registration Form</h3>
              <p className="text-sm text-muted-foreground">
                Account creation with password confirmation and terms acceptance.
              </p>
            </div>
            <div className="rounded-lg border p-4 hover:border-primary cursor-pointer">
              <h3 className="font-medium mb-2">Payment Form</h3>
              <p className="text-sm text-muted-foreground">
                Credit card inputs with validation and billing information.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4 mt-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground">
                Use Ctrl+Z for undo, Ctrl+Y for redo, Delete to remove selected elements.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Layout Options</h3>
              <p className="text-sm text-muted-foreground">
                Switch between free, grid, columns, and rows layouts for different form designs.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Save Often</h3>
              <p className="text-sm text-muted-foreground">
                Use the version history to track changes and revert if needed.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={handleClose}>
            Don't show again
          </Button>
          <Button onClick={handleClose}>Get Started</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
