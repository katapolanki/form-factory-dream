
import { useRef } from "react";
import { FormElement } from "./FormBuilder";
import FormElementRenderer from "./FormElementRenderer";
import { cn } from "@/lib/utils";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Edit, Copy, Trash } from "lucide-react";

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

  const handleElementDrag = (id: string, deltaX: number, deltaY: number) => {
    const element = elements.find(el => el.id === id);
    if (element && element.position) {
      const newPosition = {
        x: element.position.x + deltaX,
        y: element.position.y + deltaY
      };
      onUpdateElement(id, { position: newPosition });
    }
  };

  return (
    <div 
      ref={canvasRef}
      className={cn(
        "min-h-full p-8 relative", 
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
                selectedElement?.id === element.id && "ring-2 ring-primary ring-offset-2"
              )}
              style={{
                top: layout === "free" ? `${element.position?.y || 0}px` : undefined,
                left: layout === "free" ? `${element.position?.x || 0}px` : undefined,
                width: layout === "columns" ? element.style?.width : "100%",
              }}
              onClick={() => setSelectedElement(element)}
            >
              <FormElementRenderer
                element={element}
                onDrag={layout === "free" ? (deltaX, deltaY) => handleElementDrag(element.id, deltaX, deltaY) : undefined}
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
