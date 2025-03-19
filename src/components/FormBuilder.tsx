
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Grid2X2,
  Columns,
  SeparatorHorizontal,
  LayoutGrid,
  Undo2,
  Redo2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ComponentsSidebar from "@/components/ComponentsSidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import FormCanvas from "@/components/FormCanvas";
import FormPreview from "@/components/FormPreview";

// Define form element types
export const ELEMENT_TYPES = {
  // Layout elements
  TITLE: "title",
  SUBTITLE: "subtitle",
  PARAGRAPH: "paragraph",
  SEPARATOR: "separator",
  SPACER: "spacer",
  HEADING: "heading",
  DIVIDER: "divider",

  // Form elements
  TEXT: "text",
  NUMBER: "number",
  TEXTAREA: "textarea",
  DATE: "date",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SELECT: "select",
  INPUT: "input",
  BUTTON: "button",

  // shadcn/ui components
  ACCORDION: "accordion",
  ALERT: "alert",
  ALERT_DIALOG: "alert-dialog",
  ASPECT_RATIO: "aspect-ratio",
  AVATAR: "avatar",
  BADGE: "badge",
  BREADCRUMB: "breadcrumb",
  CALENDAR: "calendar",
  CARD: "card",
  CAROUSEL: "carousel",
  CHART: "chart",
  COLLAPSIBLE: "collapsible",
  COMBOBOX: "combobox",
  COMMAND: "command",
  CONTEXT_MENU: "context-menu",
  DATA_TABLE: "data-table",
  DATE_PICKER: "date-picker",
  DIALOG: "dialog",
  DRAWER: "drawer",
  DROPDOWN_MENU: "dropdown-menu",
};

// Define form element type
export type ElementType = 
  | "heading" 
  | "paragraph" 
  | "input" 
  | "textarea" 
  | "checkbox" 
  | "radio" 
  | "select" 
  | "button" 
  | "divider" 
  | "spacer"
  | "title"
  | "subtitle"
  | "separator"
  | "text"
  | "number"
  | "date"
  | "accordion"
  | "alert"
  | "alert-dialog"
  | "aspect-ratio"
  | "avatar"
  | "badge"
  | "breadcrumb"
  | "calendar"
  | "card"
  | "carousel"
  | "chart"
  | "collapsible"
  | "combobox"
  | "command"
  | "context-menu"
  | "data-table"
  | "date-picker"
  | "dialog"
  | "drawer"
  | "dropdown-menu";

// Define form element interface
export interface FormElement {
  id: string;
  type: ElementType;
  content?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  helpText?: string;
  style?: {
    width?: string;
    backgroundColor?: string;
    textColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    paddingY?: string;
    paddingX?: string;
    marginY?: string;
    marginX?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
    opacity?: string;
    shadow?: string;
  };
  position?: {
    x: number;
    y: number;
    type?: "static" | "relative" | "absolute" | "fixed";
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
    zIndex?: string;
    align?: "left" | "center" | "right";
    gridColumn?: string;
    gridRow?: string;
    hideMobile?: boolean;
    hideTablet?: boolean;
    hideDesktop?: boolean;
  };
  width?: "full" | "medium" | "small" | "tiny" | "custom";
  customWidth?: string;
  customWidthUnit?: "px" | "%" | "rem" | "em";
  size?: "xs" | "small" | "default" | "large" | "xl";
  labelPosition?: "top" | "left" | "right" | "bottom" | "hidden";
  textAlign?: "left" | "center" | "right" | "justify";
  customClass?: string;
  hidden?: boolean;
  isSelected?: boolean;
  
  // Text input specific
  defaultValue?: string | number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  inputMode?: string;
  autocomplete?: string;
  
  // Number input specific
  min?: number;
  max?: number;
  step?: number;
  
  // Textarea specific
  rows?: number;
  resizable?: "none" | "vertical" | "horizontal" | "both";
  
  // Checkbox specific
  defaultChecked?: boolean;
  checkboxPosition?: "left" | "right";
  
  // Button specific
  buttonVariant?: string;
  buttonType?: string;
  icon?: string;
  iconPosition?: string;
  
  // Validation
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  customValidation?: string;
}

const FormBuilder = () => {
  const [elements, setElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
  const [layout, setLayout] = useState<"free" | "grid" | "columns" | "rows">("free");
  const [history, setHistory] = useState<FormElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Add element to canvas
  const addElement = (type: ElementType) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      content: getDefaultContent(type),
      style: {
        width: "100%",
        backgroundColor: "transparent",
        textColor: "",
        borderRadius: "0.375rem",
        padding: "0.5rem",
        fontSize: "1rem",
        fontWeight: "normal",
      },
      position: { x: 0, y: 0 },
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    toast.success(`Added ${type} element`);
  };

  // Get default content based on element type
  const getDefaultContent = (type: ElementType): string => {
    switch (type) {
      case "heading":
        return "Heading";
      case "paragraph":
        return "This is a paragraph of text.";
      case "button":
        return "Button";
      case "input":
        return "Label";
      case "textarea":
        return "Text Area Label";
      case "checkbox":
        return "Checkbox Label";
      case "radio":
        return "Radio Button";
      case "select":
        return "Select Option";
      default:
        return "";
    }
  };

  // Update element
  const updateElement = (id: string, updates: Partial<FormElement>) => {
    const updatedElements = elements.map(element => 
      element.id === id ? { ...element, ...updates } : element
    );
    setElements(updatedElements);
    
    // Update selected element if it's the one being modified
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement({ ...selectedElement, ...updates });
    }
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updatedElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Delete element
  const deleteElement = (id: string) => {
    const filteredElements = elements.filter(element => element.id !== id);
    setElements(filteredElements);
    
    if (selectedElement && selectedElement.id === id) {
      setSelectedElement(null);
    }
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(filteredElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    toast.success("Element deleted");
  };

  // Duplicate element
  const duplicateElement = (id: string) => {
    const elementToDuplicate = elements.find(element => element.id === id);
    if (elementToDuplicate) {
      const newElement = {
        ...elementToDuplicate,
        id: uuidv4(),
        content: `${elementToDuplicate.content} (copy)`,
        position: {
          x: (elementToDuplicate.position?.x || 0) + 20,
          y: (elementToDuplicate.position?.y || 0) + 20,
        },
      };
      
      const newElements = [...elements, newElement];
      setElements(newElements);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      toast.success("Element duplicated");
    }
  };

  // Undo/Redo functions
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      toast.info("Undo");
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      toast.info("Redo");
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active && active.id) {
      const activeId = String(active.id);
      const element = elements.find(el => el.id === activeId);
      
      if (element) {
        // Update element position
        const delta = event.delta;
        const currentPosition = element.position || { x: 0, y: 0 };
        
        updateElement(activeId, {
          position: {
            x: currentPosition.x + delta.x,
            y: currentPosition.y + delta.y,
          }
        });
      }
    }
  };

  if (showPreview) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Exit Preview
          </Button>
        </div>
        <FormPreview elements={elements} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
      {/* Component Sidebar */}
      <div className="col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden">
        <ComponentsSidebar onAddElement={addElement} />
      </div>
      
      {/* Form Canvas */}
      <div className="col-span-8 flex flex-col">
        <div className="bg-card rounded-lg shadow-sm border mb-4 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("gap-1", layout === "free" && "bg-accent")}
                onClick={() => setLayout("free")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Free</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("gap-1", layout === "grid" && "bg-accent")}
                onClick={() => setLayout("grid")}
              >
                <Grid2X2 className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Grid</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("gap-1", layout === "columns" && "bg-accent")}
                onClick={() => setLayout("columns")}
              >
                <Columns className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Columns</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn("gap-1", layout === "rows" && "bg-accent")}
                onClick={() => setLayout("rows")}
              >
                <SeparatorHorizontal className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:text-xs">Rows</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
            </div>
          </div>
        </div>
        
        <div 
          id="form-canvas" 
          className="bg-card rounded-lg shadow-sm border flex-grow overflow-auto"
        >
          <DndContext 
            sensors={sensors}
            modifiers={[restrictToWindowEdges]}
            onDragEnd={handleDragEnd}
          >
            <FormCanvas 
              elements={elements}
              selectedElement={selectedElement}
              setSelectedElement={setSelectedElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
              layout={layout}
            />
          </DndContext>
        </div>
      </div>
      
      {/* Properties Panel */}
      <div className="col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden">
        <PropertiesPanel 
          selectedElement={selectedElement}
          onUpdateElement={updateElement}
        />
      </div>
    </div>
  );
};

export default FormBuilder;
