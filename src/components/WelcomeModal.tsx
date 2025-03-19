
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutTemplate, FileCode, MousePointer2, Wand2 } from "lucide-react";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Welcome to FormCraft
          </DialogTitle>
          <DialogDescription>
            The ultimate tool for creating beautiful forms with ease.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="templates">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="tips">Quick Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="aspect-video rounded bg-muted flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium">Contact Form</h3>
                <p className="text-sm text-muted-foreground">A simple contact form with validation</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="aspect-video rounded bg-muted flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium">Registration Form</h3>
                <p className="text-sm text-muted-foreground">User registration with multiple steps</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="aspect-video rounded bg-muted flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium">Survey Form</h3>
                <p className="text-sm text-muted-foreground">Collect feedback with various question types</p>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                <div className="aspect-video rounded bg-muted flex items-center justify-center mb-2">
                  <LayoutTemplate className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium">Blank Form</h3>
                <p className="text-sm text-muted-foreground">Start from scratch with a blank canvas</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-3">
                <MousePointer2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Drag & Drop Builder</h3>
                  <p className="text-sm text-muted-foreground">Easily build forms with our intuitive drag and drop interface</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <LayoutTemplate className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Form Templates</h3>
                  <p className="text-sm text-muted-foreground">Start quickly with our pre-built form templates</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <FileCode className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Export Options</h3>
                  <p className="text-sm text-muted-foreground">Export your forms as HTML or JSON</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Wand2 className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-medium">Theme Customization</h3>
                  <p className="text-sm text-muted-foreground">Customize colors, fonts, and styles to match your brand</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Getting Started Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">1</span>
                  <span>Drag components from the sidebar onto the canvas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">2</span>
                  <span>Click on any element to edit its properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">3</span>
                  <span>Use the layout options to organize your form elements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs shrink-0">4</span>
                  <span>Save often to prevent losing your work</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={handleClose}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
