
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { 
  Textarea 
} from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Brush, 
  Layout, 
  TextCursor,
  ClipboardCheck 
} from "lucide-react";
import { FormElement } from "./FormBuilder";

interface PropertiesPanelProps {
  selectedElement: FormElement | null;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
}

const PropertiesPanel = ({ selectedElement, onUpdateElement }: PropertiesPanelProps) => {
  const [activeTab, setActiveTab] = useState("content");

  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="font-medium">Properties</h2>
        </div>
        <div className="flex-grow flex items-center justify-center p-8 text-center text-muted-foreground">
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }

  const handleContentChange = (content: string) => {
    onUpdateElement(selectedElement.id, { content });
  };

  const handlePlaceholderChange = (placeholder: string) => {
    onUpdateElement(selectedElement.id, { placeholder });
  };

  const handleRequiredChange = (required: boolean) => {
    onUpdateElement(selectedElement.id, { required });
  };

  const handleStyleChange = (property: string, value: string) => {
    const style = { ...selectedElement.style, [property]: value };
    onUpdateElement(selectedElement.id, { style });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-medium">Properties</h2>
        <div className="text-xs text-muted-foreground mt-1">
          Editing: <span className="capitalize">{selectedElement.type}</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-4 mx-4 my-2">
          <TabsTrigger value="content" className="h-8 text-xs">
            <TextCursor className="h-3 w-3 mr-1" />
            Content
          </TabsTrigger>
          <TabsTrigger value="style" className="h-8 text-xs">
            <Brush className="h-3 w-3 mr-1" />
            Style
          </TabsTrigger>
          <TabsTrigger value="layout" className="h-8 text-xs">
            <Layout className="h-3 w-3 mr-1" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="validation" className="h-8 text-xs">
            <ClipboardCheck className="h-3 w-3 mr-1" />
            Validate
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-grow overflow-auto">
          <TabsContent value="content" className="p-4 space-y-4 m-0">
            {(selectedElement.type === "heading" || 
              selectedElement.type === "paragraph" || 
              selectedElement.type === "button" ||
              selectedElement.type === "input" ||
              selectedElement.type === "textarea" ||
              selectedElement.type === "checkbox" ||
              selectedElement.type === "radio" ||
              selectedElement.type === "select") && (
              <div className="space-y-2">
                <Label htmlFor="element-content">Content/Label</Label>
                <Input
                  id="element-content"
                  value={selectedElement.content || ""}
                  onChange={(e) => handleContentChange(e.target.value)}
                />
              </div>
            )}
            
            {(selectedElement.type === "input" || 
              selectedElement.type === "textarea" || 
              selectedElement.type === "select") && (
              <div className="space-y-2">
                <Label htmlFor="element-placeholder">Placeholder</Label>
                <Input
                  id="element-placeholder"
                  value={selectedElement.placeholder || ""}
                  onChange={(e) => handlePlaceholderChange(e.target.value)}
                />
              </div>
            )}
            
            {(selectedElement.type === "input" || 
              selectedElement.type === "textarea" || 
              selectedElement.type === "checkbox" ||
              selectedElement.type === "radio" ||
              selectedElement.type === "select") && (
              <div className="flex items-center justify-between">
                <Label htmlFor="element-required">Required</Label>
                <Switch
                  id="element-required"
                  checked={selectedElement.required || false}
                  onCheckedChange={handleRequiredChange}
                />
              </div>
            )}
            
            {selectedElement.type === "select" && (
              <div className="space-y-2">
                <Label htmlFor="element-options">Options (one per line)</Label>
                <Textarea
                  id="element-options"
                  value={(selectedElement.options || []).join("\n")}
                  onChange={(e) => {
                    const options = e.target.value.split("\n").filter(opt => opt.trim() !== "");
                    onUpdateElement(selectedElement.id, { options });
                  }}
                  rows={5}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="p-4 space-y-4 m-0">
            <div className="space-y-2">
              <Label htmlFor="element-width">Width</Label>
              <Select
                value={selectedElement.style?.width || "100%"}
                onValueChange={(value) => handleStyleChange("width", value)}
              >
                <SelectTrigger id="element-width">
                  <SelectValue placeholder="Select width" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100%">Full width</SelectItem>
                  <SelectItem value="75%">75%</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                  <SelectItem value="25%">25%</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-font-size">Font Size</Label>
              <Select
                value={selectedElement.style?.fontSize || "1rem"}
                onValueChange={(value) => handleStyleChange("fontSize", value)}
              >
                <SelectTrigger id="element-font-size">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.875rem">Small</SelectItem>
                  <SelectItem value="1rem">Medium</SelectItem>
                  <SelectItem value="1.25rem">Large</SelectItem>
                  <SelectItem value="1.5rem">X-Large</SelectItem>
                  <SelectItem value="2rem">XX-Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-font-weight">Font Weight</Label>
              <Select
                value={selectedElement.style?.fontWeight || "normal"}
                onValueChange={(value) => handleStyleChange("fontWeight", value)}
              >
                <SelectTrigger id="element-font-weight">
                  <SelectValue placeholder="Select font weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-padding">Padding</Label>
              <Select
                value={selectedElement.style?.padding || "0.5rem"}
                onValueChange={(value) => handleStyleChange("padding", value)}
              >
                <SelectTrigger id="element-padding">
                  <SelectValue placeholder="Select padding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="0.25rem">XS</SelectItem>
                  <SelectItem value="0.5rem">S</SelectItem>
                  <SelectItem value="1rem">M</SelectItem>
                  <SelectItem value="1.5rem">L</SelectItem>
                  <SelectItem value="2rem">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-border-radius">Border Radius</Label>
              <Select
                value={selectedElement.style?.borderRadius || "0.375rem"}
                onValueChange={(value) => handleStyleChange("borderRadius", value)}
              >
                <SelectTrigger id="element-border-radius">
                  <SelectValue placeholder="Select border radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="0.125rem">XS</SelectItem>
                  <SelectItem value="0.375rem">S</SelectItem>
                  <SelectItem value="0.5rem">M</SelectItem>
                  <SelectItem value="0.75rem">L</SelectItem>
                  <SelectItem value="1rem">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-text-color">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="element-text-color"
                  type="color"
                  value={selectedElement.style?.textColor || "#000000"}
                  onChange={(e) => handleStyleChange("textColor", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={selectedElement.style?.textColor || ""}
                  onChange={(e) => handleStyleChange("textColor", e.target.value)}
                  placeholder="#000000"
                  className="flex-grow"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="element-background-color">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="element-background-color"
                  type="color"
                  value={selectedElement.style?.backgroundColor || "#ffffff"}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={selectedElement.style?.backgroundColor || ""}
                  onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                  placeholder="transparent"
                  className="flex-grow"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="layout" className="p-4 space-y-4 m-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="position-x" className="text-xs">X Position</Label>
                    <Input
                      id="position-x"
                      type="number"
                      value={selectedElement.position?.x || 0}
                      onChange={(e) => {
                        const position = { 
                          ...selectedElement.position, 
                          x: parseInt(e.target.value) || 0 
                        };
                        onUpdateElement(selectedElement.id, { position });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position-y" className="text-xs">Y Position</Label>
                    <Input
                      id="position-y"
                      type="number"
                      value={selectedElement.position?.y || 0}
                      onChange={(e) => {
                        const position = { 
                          ...selectedElement.position, 
                          y: parseInt(e.target.value) || 0 
                        };
                        onUpdateElement(selectedElement.id, { position });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="validation" className="p-4 space-y-4 m-0">
            {(selectedElement.type === "input" || selectedElement.type === "textarea") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-length">Maximum Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validation-pattern">Pattern (Regex)</Label>
                  <Input
                    id="validation-pattern"
                    placeholder="e.g. [A-Za-z]+"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="error-message">Error Message</Label>
                  <Input
                    id="error-message"
                    placeholder="Please enter a valid value"
                  />
                </div>
              </>
            )}
            
            {selectedElement.type !== "input" && selectedElement.type !== "textarea" && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Validation options are not available for this element type.</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PropertiesPanel;
