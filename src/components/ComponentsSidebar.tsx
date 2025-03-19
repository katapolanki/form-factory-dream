
import { useMemo, useState } from "react";
import { useDrag } from "react-dnd";
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
  Divide
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ElementType } from "./FormBuilder";

interface ComponentItem {
  type: ElementType;
  name: string;
  icon: React.ReactNode;
  category: "basic" | "input" | "layout";
}

interface ComponentsSidebarProps {
  onAddElement: (type: ElementType) => void;
}

const DraggableComponent = ({ component }: { component: ComponentItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "COMPONENT",
    item: { type: component.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-grab select-none"
      style={{ opacity: isDragging ? 0.5 : 1 }}
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

  const components: ComponentItem[] = [
    // Basic components
    { type: "heading", name: "Heading", icon: <Type size={18} />, category: "basic" },
    { type: "paragraph", name: "Paragraph", icon: <AlignLeft size={18} />, category: "basic" },
    { type: "button", name: "Button", icon: <MousePointerClick size={18} />, category: "basic" },
    { type: "divider", name: "Divider", icon: <Minus size={18} />, category: "layout" },
    { type: "spacer", name: "Spacer", icon: <Box size={18} />, category: "layout" },
    
    // Input components
    { type: "input", name: "Text Input", icon: <TextCursorInput size={18} />, category: "input" },
    { type: "textarea", name: "Text Area", icon: <AlignLeft size={18} />, category: "input" },
    { type: "checkbox", name: "Checkbox", icon: <Square size={18} />, category: "input" },
    { type: "radio", name: "Radio", icon: <CircleCheck size={18} />, category: "input" },
    { type: "select", name: "Select", icon: <ListFilter size={18} />, category: "input" },
    { type: "input", name: "Number", icon: <SlidersHorizontal size={18} />, category: "input" },
    { type: "input", name: "Email", icon: <File size={18} />, category: "input" },
    { type: "input", name: "Date", icon: <Calendar size={18} />, category: "input" },
    { type: "input", name: "File Upload", icon: <Upload size={18} />, category: "input" },
    { type: "input", name: "Rating", icon: <Star size={18} />, category: "input" },
  ];

  // Filter components based on search term and category
  const filteredComponents = useMemo(() => {
    return components.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || component.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, selectedCategory]);

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
      
      <div className="flex border-b">
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
          className={`flex-1 rounded-none ${selectedCategory === "basic" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("basic")}
        >
          Basic
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
          className={`flex-1 rounded-none ${selectedCategory === "layout" ? "bg-accent" : ""}`}
          onClick={() => setSelectedCategory("layout")}
        >
          Layout
        </Button>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-1">
          {filteredComponents.map((component) => (
            <DraggableComponent key={`${component.type}-${component.name}`} component={component} />
          ))}
          
          {filteredComponents.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No components found
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" onClick={() => {}}>
          <Divide className="mr-2 h-4 w-4" /> Custom Component
        </Button>
      </div>
    </div>
  );
};

export default ComponentsSidebar;
