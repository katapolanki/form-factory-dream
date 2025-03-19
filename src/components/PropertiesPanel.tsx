
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
  ClipboardCheck,
  Accessibility
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
        <TabsList className="grid grid-cols-5 mx-4 my-2">
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
          <TabsTrigger value="a11y" className="h-8 text-xs">
            <Accessibility className="h-3 w-3 mr-1" />
            A11y
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
              
              <div className="space-y-2">
                <Label htmlFor="position-type">Position Type</Label>
                <Select
                  value={selectedElement.position?.type || "static"}
                  onValueChange={(value) => {
                    const position = { 
                      ...selectedElement.position, 
                      type: value as "static" | "relative" | "absolute" | "fixed" 
                    };
                    onUpdateElement(selectedElement.id, { position });
                  }}
                >
                  <SelectTrigger id="position-type">
                    <SelectValue placeholder="Select position type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static</SelectItem>
                    <SelectItem value="relative">Relative</SelectItem>
                    <SelectItem value="absolute">Absolute</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Responsive Visibility</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hide-mobile" 
                      checked={!selectedElement.position?.hideMobile}
                      onCheckedChange={(checked) => {
                        const position = { 
                          ...selectedElement.position, 
                          hideMobile: !checked 
                        };
                        onUpdateElement(selectedElement.id, { position });
                      }}
                    />
                    <Label htmlFor="hide-mobile" className="text-xs">Mobile</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hide-tablet" 
                      checked={!selectedElement.position?.hideTablet}
                      onCheckedChange={(checked) => {
                        const position = { 
                          ...selectedElement.position, 
                          hideTablet: !checked 
                        };
                        onUpdateElement(selectedElement.id, { position });
                      }}
                    />
                    <Label htmlFor="hide-tablet" className="text-xs">Tablet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="hide-desktop" 
                      checked={!selectedElement.position?.hideDesktop}
                      onCheckedChange={(checked) => {
                        const position = { 
                          ...selectedElement.position, 
                          hideDesktop: !checked 
                        };
                        onUpdateElement(selectedElement.id, { position });
                      }}
                    />
                    <Label htmlFor="hide-desktop" className="text-xs">Desktop</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="validation" className="p-4 space-y-4 m-0">
            {(selectedElement.type === "input" || 
              selectedElement.type === "text" || 
              selectedElement.type === "textarea") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="min-length">Minimum Length</Label>
                  <Input
                    id="min-length"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={selectedElement.minLength || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      onUpdateElement(selectedElement.id, { minLength: value });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-length">Maximum Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    min="0"
                    placeholder="Unlimited"
                    value={selectedElement.maxLength || ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : undefined;
                      onUpdateElement(selectedElement.id, { maxLength: value });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validation-pattern">Pattern (Regex)</Label>
                  <Input
                    id="validation-pattern"
                    placeholder="e.g. [A-Za-z]+"
                    value={selectedElement.pattern || ""}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, { pattern: e.target.value });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-validation">Custom Validation</Label>
                  <Textarea
                    id="custom-validation"
                    placeholder="e.g. value.includes('@') && value.includes('.')"
                    value={selectedElement.customValidation || ""}
                    onChange={(e) => {
                      onUpdateElement(selectedElement.id, { customValidation: e.target.value });
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    JavaScript expression that returns true/false. The variable 'value' contains the input value.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="validate-on-blur" 
                      checked={selectedElement.validateOnBlur || false}
                      onCheckedChange={(checked) => {
                        onUpdateElement(selectedElement.id, { validateOnBlur: checked });
                      }}
                    />
                    <Label htmlFor="validate-on-blur">Validate on Blur</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="validate-on-change" 
                      checked={selectedElement.validateOnChange || false}
                      onCheckedChange={(checked) => {
                        onUpdateElement(selectedElement.id, { validateOnChange: checked });
                      }}
                    />
                    <Label htmlFor="validate-on-change">Validate on Change</Label>
                  </div>
                </div>
              </>
            )}
            
            {selectedElement.type === "number" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="min-value">Minimum Value</Label>
                  <Input
                    id="min-value"
                    type="number"
                    placeholder="No minimum"
                    value={selectedElement.min ?? ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      onUpdateElement(selectedElement.id, { min: value });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-value">Maximum Value</Label>
                  <Input
                    id="max-value"
                    type="number"
                    placeholder="No maximum"
                    value={selectedElement.max ?? ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      onUpdateElement(selectedElement.id, { max: value });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="step-value">Step</Label>
                  <Input
                    id="step-value"
                    type="number"
                    min="0"
                    step="any"
                    placeholder="1"
                    value={selectedElement.step ?? ""}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      onUpdateElement(selectedElement.id, { step: value });
                    }}
                  />
                </div>
              </>
            )}
            
            {(selectedElement.type !== "input" && 
              selectedElement.type !== "text" && 
              selectedElement.type !== "textarea" && 
              selectedElement.type !== "number") && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Validation options are not available for this element type.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="a11y" className="p-4 space-y-4 m-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aria-label">ARIA Label</Label>
                <Input
                  id="aria-label"
                  placeholder="Descriptive label for screen readers"
                  value={selectedElement.ariaLabel || ""}
                  onChange={(e) => {
                    onUpdateElement(selectedElement.id, { ariaLabel: e.target.value });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Provides an accessible name for screen readers when visual label is not present.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aria-description">ARIA Description</Label>
                <Textarea
                  id="aria-description"
                  placeholder="Additional information about this element"
                  value={selectedElement.ariaDescription || ""}
                  onChange={(e) => {
                    onUpdateElement(selectedElement.id, { ariaDescription: e.target.value });
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Provides additional descriptive information for screen readers.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>ARIA Role</Label>
                <Select
                  value={selectedElement.role || ""}
                  onValueChange={(value) => {
                    onUpdateElement(selectedElement.id, { role: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ARIA role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="button">Button</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="textbox">Textbox</SelectItem>
                    <SelectItem value="radio">Radio</SelectItem>
                    <SelectItem value="heading">Heading</SelectItem>
                    <SelectItem value="img">Image</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="navigation">Navigation</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Defines the type of element to assistive technologies.
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="tab-index" 
                  checked={selectedElement.tabIndex !== undefined}
                  onCheckedChange={(checked) => {
                    onUpdateElement(selectedElement.id, { 
                      tabIndex: checked ? 0 : undefined 
                    });
                  }}
                />
                <Label htmlFor="tab-index">Include in Tab Order</Label>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PropertiesPanel;
