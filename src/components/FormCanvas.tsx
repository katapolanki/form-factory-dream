import { useCallback, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  type DragEndEvent,
  MeasuringStrategy
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { 
  Lock, 
  Unlock, 
  Group, 
  Ungroup,
  Eye, 
  EyeOff,
  Copy,
  Trash2,
  GripVertical,
  ArrowUpDown,
  Paintbrush,
  Code2,
  ScanEye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFormDesigner } from "@/hooks/use-form-designer";
import FormElementRenderer from "./FormElementRenderer";
import { CanvasGrid } from "./CanvasGrid";
import { ElementStyleControls } from "./ElementStyleControls";
import { BreakpointSwitcher } from "./BreakpointSwitcher";

const FormCanvas = () => {
  const {
    elements,
    selectedElement,
    layout,
    breakpoint,
    gridSize,
    snapToGrid,
    actions,
    history
  } = useFormDesigner();
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const { setNodeRef } = useDroppable({ id: "canvas-drop-area" });
  const measuringConfig = { droppable: { strategy: MeasuringStrategy.Always } };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = elements.findIndex(el => el.id === active.id);
    const newIndex = elements.findIndex(el => el.id === over.id);
    actions.reorderElements(arrayMove(elements, oldIndex, newIndex));
  }, [elements]);

  const handleContextMenuAction = useCallback((action: string, id: string) => {
    switch (action) {
      case 'duplicate':
        actions.duplicateElement(id);
        break;
      case 'delete':
        actions.deleteElement(id);
        break;
      case 'toggle-visibility':
        actions.toggleElementVisibility(id);
        break;
      case 'toggle-lock':
        actions.toggleElementLock(id);
        break;
      case 'group':
        // Implement grouping logic
        break;
    }
  }, []);

  const activeElement = useMemo(() => 
    elements.find(el => el.id === activeId),
    [activeId, elements]
  );

  return (
    <DndContext
      id="canvas-dnd-context"
      measuring={measuringConfig}
      modifiers={[restrictToParentElement]}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <BreakpointSwitcher
            breakpoint={breakpoint}
            onChange={actions.setBreakpoint}
          />
          <CanvasGrid
            gridSize={gridSize}
            snapToGrid={snapToGrid}
            onGridSizeChange={actions.setGridSize}
            onSnapToggle={actions.toggleSnapToGrid}
          />
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            "flex-1 overflow-auto relative bg-canvas",
            layout === "grid" && "bg-grid-pattern",
            layout === "columns" && "flex gap-4 p-4",
            layout === "rows" && "flex flex-col gap-4 p-4"
          )}
        >
          <SortableContext
            items={elements}
            strategy={verticalListSortingStrategy}
          >
            {elements.map(element => (
              <ContextMenu key={element.id}>
                <ContextMenuTrigger>
                  <div
                    className={cn(
                      "relative group",
                      element.hidden && "opacity-40",
                      element.locked && "cursor-not-allowed",
                      selectedElement?.id === element.id && "ring-2 ring-primary"
                    )}
                    style={{
                      width: element.responsiveStyles?.[breakpoint]?.width || "100%"
                    }}
                  >
                    <FormElementRenderer
                      element={element}
                      isBuilderMode={true}
                    />
                    
                    {/* Element controls */}
                    <div className="absolute top-0 left-0 -translate-x-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => actions.selectElement(element.id)}
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <button
                        className="text-muted-foreground hover:text-foreground ml-1"
                        onClick={() => actions.toggleElementLock(element.id)}
                      >
                        {element.locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </ContextMenuTrigger>
                
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => actions.duplicateElement(element.id)}>
                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => actions.toggleElementVisibility(element.id)}>
                    {element.hidden ? (
                      <>
                        <Eye className="mr-2 h-4 w-4" /> Show
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" /> Hide
                      </>
                    )}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => actions.deleteElement(element.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </ContextMenuItem>
                  <ContextMenu.Separator />
                  <ContextMenuItem>
                    <Paintbrush className="mr-2 h-4 w-4" /> Style
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Code2 className="mr-2 h-4 w-4" /> Code
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <ScanEye className="mr-2 h-4 w-4" /> Inspect
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeElement ? (
            <FormElementRenderer
              element={activeElement}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default FormCanvas;
