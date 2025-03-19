
import { useMemo, useState } from "react";
import { 
  Search, 
  Type, 
  AlignLeft, 
  Square, 
  CircleCheck, 
  ListFilter, 
  SlidersHorizontal,
  Minus, 
  Box, 
  TextCursorInput,
  MousePointerClick,
  Calendar,
  File,
  Upload,
  Star,
  Divide,
  Heading1,
  Heading2,
  Paragraph,
  SeparatorHorizontal,
  Space,
  Table,
  BellRing,
  AlertTriangle,
  AspectRatio,
  User,
  Tag,
  ChevronRight,
  Card,
  Images,
  BarChart,
  ChevronsUpDown,
  Command,
  Menu,
  CalendarDays,
  PanelRightOpen,
  PackagePlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDraggable } from "@dnd-kit/core";
import { ElementType, ELEMENT_TYPES } from "./FormBuilder";
import CreateCustomComponent from "./CreateCustomComponent";

interface ComponentItem {
  type: ElementType;
  name: string;
  icon: React.ReactNode;
  category: "basic" | "input" | "layout" | "ui-components";
  description?: string;
}

interface ComponentsSidebarProps {
  onAddElement: (type: ElementType) => void;
}

const DraggableComponent = ({ component }: { component: ComponentItem }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${component.type}`,
    data: {
      type: component.type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-grab select-none"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      title={component.description}
    >
      <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted">
        {component.icon}
      </div>
      <span className="text-sm">{component.name}</span>
    </div>
  );
};

const ComponentsSidebar = ({ onAddElement }: ComponentsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCustomComponentDialog, setShowCustomComponentDialog] = useState(false);

  const components: ComponentItem[] = [
    // Layout elements
    { type: "title", name: "Title", icon: <Heading1 size={18} />, category: "layout", description: "Large heading for sections" },
    { type: "subtitle", name: "Subtitle", icon: <Heading2 size={18} />, category: "layout", description: "Secondary heading" },
    { type: "heading", name: "Heading", icon: <Type size={18} />, category: "layout", description: "Section heading" },
    { type: "paragraph", name: "Paragraph", icon: <Paragraph size={18} />, category: "layout", description: "Text paragraph" },
    { type: "divider", name: "Divider", icon: <Minus size={18} />, category: "layout", description: "Horizontal divider" },
    { type: "separator", name: "Separator", icon: <SeparatorHorizontal size={18} />, category: "layout", description: "Section separator" },
    { type: "spacer", name: "Spacer", icon: <Space size={18} />, category: "layout", description: "Empty space" },
    
    // Input components
    { type: "text", name: "Text Input", icon: <TextCursorInput size={18} />, category: "input", description: "Single line text field" },
    { type: "number", name: "Number", icon: <SlidersHorizontal size={18} />, category: "input", description: "Numeric input field" },
    { type: "input", name: "Input Field", icon: <TextCursorInput size={18} />, category: "input", description: "Basic input field" },
    { type: "textarea", name: "Text Area", icon: <AlignLeft size={18} />, category: "input", description: "Multi-line text field" },
    { type: "checkbox", name: "Checkbox", icon: <Square size={18} />, category: "input", description: "Checkbox field" },
    { type: "radio", name: "Radio", icon: <CircleCheck size={18} />, category: "input", description: "Radio button group" },
    { type: "select", name: "Select", icon: <ListFilter size={18} />, category: "input", description: "Dropdown select field" },
    { type: "date", name: "Date Input", icon: <Calendar size={18} />, category: "input", description: "Date picker" },
    { type: "button", name: "Button", icon: <MousePointerClick size={18} />, category: "input", description: "Interactive button" },
    
    // UI Components
    { type: "accordion", name: "Accordion", icon: <ChevronsUpDown size={18} />, category: "ui-components", description: "Collapsible content sections" },
    { type: "alert", name: "Alert", icon: <BellRing size={18} />, category: "ui-components", description: "Contextual feedback message" },
    { type: "alert-dialog", name: "Alert Dialog", icon: <AlertTriangle size={18} />, category: "ui-components", description: "Modal dialog for important notifications" },
    { type: "aspect-ratio", name: "Aspect Ratio", icon: <AspectRatio size={18} />, category: "ui-components", description: "Maintain element proportions" },
    { type: "avatar", name: "Avatar", icon: <User size={18} />, category: "ui-components", description: "User or entity representation" },
    { type: "badge", name: "Badge", icon: <Tag size={18} />, category: "ui-components", description: "Small status indicator" },
    { type: "card", name: "Card", icon: <Card size={18} />, category: "ui-components", description: "Content container with padding and border" },
    { type: "carousel", name: "Carousel", icon: <Images size={18} />, category: "ui-components", description: "Slideshow component" },
    { type: "chart", name: "Chart", icon: <BarChart size={18} />, category: "ui-components", description: "Data visualization" },
    { type: "collapsible", name: "Collapsible", icon: <ChevronsUpDown size={18} />, category: "ui-components", description: "Toggle content visibility" },
    { type: "command", name: "Command", icon: <Command size={18} />, category: "ui-components", description: "Command/search interface" },
    { type: "context-menu", name: "Context Menu", icon: <Menu size={18} />, category: "ui-components", description: "Right-click menu" },
    { type: "date-picker", name: "Date Picker", icon: <CalendarDays size={18} />, category: "ui-components", description: "Advanced date selection" },
    { type: "drawer", name: "Drawer", icon: <PanelRightOpen size={18} />, category: "ui-components", description: "Side panel menu" },
    { type: "dropdown-menu", name: "Dropdown Menu", icon: <ChevronRight size={18} />, category: "ui-components", description: "Dropdown menu component" },
  ];

  // Filter components based on search term and category
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (component.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory || 
                             (selectedCategory === "ui-components" && component.category === "ui-components");
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, selectedCategory]);

  const handleCreateCustomComponent = (component: any) => {
    // Here you would add the custom component to your components array
    // and potentially save it to localStorage or a backend
    console.log('Custom component created:', component);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-medium mb-4">Components</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap border-b">
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none ${selectedCategory === "all" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none ${selectedCategory === "layout" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("layout")}
        >
          Layout
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none ${selectedCategory === "input" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("input")}
        >
          Input
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 rounded-none ${selectedCategory === "ui-components" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("ui-components")}
        >
          UI
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-1">
          {filteredComponents.length > 0 ? (
            filteredComponents.map((component) => (
              <div key={`${component.type}-${component.name}`} className="mb-2">
                <div 
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer select-none"
                  onClick={() => onAddElement(component.type)}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted">
                    {component.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm block">{component.name}</span>
                    {component.description && (
                      <span className="text-xs text-muted-foreground">{component.description}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No components found. Try adjusting your search.
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowCustomComponentDialog(true)}
        >
          <PackagePlus className="mr-2 h-4 w-4" /> Custom Component
        </Button>
      </div>

      <CreateCustomComponent
        open={showCustomComponentDialog}
        onOpenChange={setShowCustomComponentDialog}
        onSave={handleCreateCustomComponent}
      />
    </div>
  );
};

export default ComponentsSidebar;
