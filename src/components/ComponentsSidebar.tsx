import { useMemo, useState, useCallback } from "react";
import { 
  // Ikonok...
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDraggable } from "@dnd-kit/core";
import { ElementType, ELEMENT_TYPES } from "./FormBuilder";
import CreateCustomComponent from "./CreateCustomComponent";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalStorage } from "usehooks-ts";

interface ComponentItem {
  type: ElementType;
  name: string;
  icon: React.ReactNode;
  category: "layout" | "input" | "ui-components" | "custom";
  description?: string;
  popularity?: number;
  requiredDependencies?: string[];
  proFeature?: boolean;
}

interface ComponentsSidebarProps {
  onAddElement: (type: ElementType) => void;
  loading?: boolean;
}

const DraggableComponent = ({ component }: { component: ComponentItem }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${component.type}-${Date.now()}`,
    data: {
      type: component.type,
      metadata: component,
    },
  });

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className={cn(
            "group flex items-center gap-3 p-2 rounded-lg",
            "hover:bg-accent/50 transition-colors cursor-grab",
            "select-none border border-transparent hover:border-primary/20",
            isDragging && "opacity-50 cursor-grabbing"
          )}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted">
            {component.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{component.name}</span>
              {component.proFeature && (
                <Badge variant="premium" className="text-xs px-1.5 py-0.5">
                  Pro
                </Badge>
              )}
            </div>
            {component.description && (
              <p className="text-xs text-muted-foreground truncate">
                {component.description}
              </p>
            )}
          </div>
          {component.requiredDependencies && (
            <div className="flex gap-1.5 items-center">
              {component.requiredDependencies.map((dep) => (
                <Badge key={dep} variant="outline" className="text-xs font-mono">
                  {dep}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="right" align="start" className="max-w-[300px]">
        <div className="space-y-1.5">
          <h4 className="font-semibold">{component.name}</h4>
          <p className="text-muted-foreground text-sm">{component.description}</p>
          {component.proFeature && (
            <div className="text-xs text-amber-500 flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>Premium feature - requires Pro subscription</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const ComponentsSidebar = ({ onAddElement, loading }: ComponentsSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCustomComponentDialog, setShowCustomComponentDialog] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useLocalStorage<string[]>("recent-components", []);
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorite-components", []);

  const components: ComponentItem[] = [
    // Alap komponensek...
    // Új property-kkel:
    {
      type: "chart",
      name: "Chart",
      icon: <BarChart size={18} />,
      category: "ui-components",
      description: "Interactive data visualization with multiple chart types",
      requiredDependencies: ["chart.js", "react-chartjs-2"],
      proFeature: true,
      popularity: 95,
    },
    // Egyéb elemek...
  ];

  const categories = [
    { id: "all", label: "All", icon: <Box size={16} /> },
    { id: "layout", label: "Layout", icon: <SeparatorHorizontal size={16} /> },
    { id: "input", label: "Inputs", icon: <TextCursorInput size={16} /> },
    { id: "ui-components", label: "UI", icon: <SlidersHorizontal size={16} /> },
    { id: "custom", label: "Custom", icon: <PackagePlus size={16} /> },
  ];

  const handleAddElement = useCallback((type: ElementType) => {
    onAddElement(type);
    setRecentlyUsed(prev => Array.from(new Set([type, ...prev])).slice(0, 5));
  }, [onAddElement, setRecentlyUsed]);

  const filteredComponents = useMemo(() => {
    let result = components.filter(component => {
      const searchMatch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.type.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = selectedCategory === "all" || 
        component.category === selectedCategory ||
        (selectedCategory === "custom" && component.category === "custom");

      return searchMatch && categoryMatch;
    });

    if (selectedCategory === "recent") {
      result = result.sort((a, b) => 
        recentlyUsed.indexOf(b.type) - recentlyUsed.indexOf(a.type)
      );
    }

    if (selectedCategory === "favorites") {
      result = result.filter(comp => favorites.includes(comp.type));
    }

    return result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [components, searchTerm, selectedCategory, recentlyUsed, favorites]);

  const handleFavorite = useCallback((type: string) => {
    setFavorites(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  }, [setFavorites]);

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 pb-2 space-y-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Component Library</h2>
          <Badge variant="outline" className="text-xs">
            v2.1.0
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            className="pl-10 pr-4 h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs 
        value={selectedCategory} 
        onValueChange={setSelectedCategory}
        className="px-4 py-3 border-b"
      >
        <TabsList className="grid grid-cols-3 h-auto p-1 bg-muted/50">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="py-1.5 h-auto text-xs [&[data-state=active]]:bg-background"
            >
              <div className="flex items-center gap-1.5">
                {category.icon}
                {category.label}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[62px] w-full rounded-lg" />
            ))
          ) : filteredComponents.length > 0 ? (
            filteredComponents.map((component) => (
              <DraggableComponent
                key={`${component.type}-${component.name}`}
                component={component}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
              <Search className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-medium">No components found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background/80">
        <Button 
          variant="outline"
          className="w-full h-10 rounded-lg font-medium"
          onClick={() => setShowCustomComponentDialog(true)}
        >
          <PackagePlus className="mr-2 h-4 w-4" />
          Create Custom Component
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
