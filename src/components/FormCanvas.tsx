
import { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { FormElement } from "./FormBuilder";
import FormElementRenderer from "./FormElementRenderer";
import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Edit, Copy, Trash, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

interface FormCanvasProps {
  elements: FormElement[];
  selectedElement: FormElement | null;
  setSelectedElement: (element: FormElement | null) => void;
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  layout: "free" | "grid" | "columns" | "rows";
}

const FormCanvas = ({
  elements,
  selectedElement,
  setSelectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  layout
}: FormCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { setNodeRef } = useDroppable({
    id: 'form-canvas-droppable',
  });

  // Function to move elements up/down in the order
  const moveElement = (id: string, direction: 'up' | 'down') => {
    const elementIndex = elements.findIndex(el => el.id === id);
    if (elementIndex === -1) return;
    
    // Can't move up if already at the top
    if (direction === 'up' && elementIndex === 0) return;
    
    // Can't move down if already at the bottom
    if (direction === 'down' && elementIndex === elements.length - 1) return;
    
    const newIndex = direction === 'up' ? elementIndex - 1 : elementIndex + 1;
    
    // Create a new array with the element moved to the new position
    const newElements = [...elements];
    const [movedElement] = newElements.splice(elementIndex, 1);
    newElements.splice(newIndex, 0, movedElement);
    
    // This would require modifying the FormBuilder to accept a full elements array update
    // For now, we'll just update the positions
    if (layout === 'free' && movedElement.position && newElements[newIndex].position) {
      const tempY = movedElement.position.y;
      onUpdateElement(movedElement.id, { 
        position: { 
          ...movedElement.position, 
          y: newElements[newIndex].position.y 
        } 
      });
      onUpdateElement(newElements[newIndex].id, { 
        position: { 
          ...newElements[newIndex].position, 
          y: tempY 
        } 
      });
    }
  };

  // Function to toggle element visibility
  const toggleVisibility = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      onUpdateElement(id, { hidden: !element.hidden });
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "min-h-full p-8 relative bg-canvas", 
        layout === "grid" && "bg-grid-pattern",
        layout === "columns" && "flex flex-wrap",
        layout === "rows" && "flex flex-col gap-4"
      )}
    >
      {elements.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <p>Drag and drop components from the sidebar to start building your form</p>
        </div>
      )}
      
      {elements.map((element) => (
        <ContextMenu key={element.id}>
          <ContextMenuTrigger asChild>
            <div
              className={cn(
                "relative transition-all duration-150",
                layout === "free" && "absolute",
                layout === "grid" && "relative mb-4",
                layout === "columns" && "px-2 py-4",
                layout === "rows" && "w-full",
                selectedElement?.id === element.id && "ring-2 ring-primary ring-offset-2",
                element.hidden && "opacity-40"
              )}
              style={{
                top: layout === "free" ? `${element.position?.y || 0}px` : undefined,
                left: layout === "free" ? `${element.position?.x || 0}px` : undefined,
                width: layout === "columns" ? element.style?.width : undefined,
                display: element.hidden ? 'opacity-50' : undefined,
              }}
              onClick={() => setSelectedElement(element)}
            >
              <FormElementRenderer
                element={element}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => setSelectedElement(element)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onDuplicateElement(element.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </ContextMenuItem>
            <ContextMenuItem onClick={() => moveElement(element.id, 'up')}>
              <ArrowUp className="mr-2 h-4 w-4" />
              Move Up
            </ContextMenuItem>
            <ContextMenuItem onClick={() => moveElement(element.id, 'down')}>
              <ArrowDown className="mr-2 h-4 w-4" />
              Move Down
            </ContextMenuItem>
            <ContextMenuItem onClick={() => toggleVisibility(element.id)}>
              {element.hidden ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Show
                </>
              ) : (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Hide
                </>
              )}
            </ContextMenuItem>
            <ContextMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDeleteElement(element.id)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </div>
  );
};

export default FormCanvas;
