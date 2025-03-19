import { useState, useReducer, useCallback, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { 
  DndContext, 
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  MouseSensor,
  MeasuringStrategy,
  useDroppable
} from "@dnd-kit/core";
import { 
  restrictToParentElement,
  snapCenterToCursor
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Button,
  Tooltip,
  Toast,
  useToast
} from "@/components/ui";
import { 
  Grid2X2,
  Columns,
  SeparatorHorizontal,
  LayoutGrid,
  Undo2,
  Redo2,
  Eye,
  Save,
  Code,
  Lock,
  Unlock,
  Group,
  Ungroup,
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Trash2,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage, useThrottledCallback } from "usehooks-ts";
import ComponentsSidebar from "@/components/ComponentsSidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import FormCanvas from "@/components/FormCanvas";
import FormPreview from "@/components/FormPreview";
import { 
  FormElement, 
  ElementType, 
  FormElementInstance, 
  FormLayout,
  FormBreakpoint
} from "@/types";
import { formReducer } from "@/reducers/formReducer";
import { 
  generateFormCode,
  exportAsReactComponent,
  exportAsHTML
} from "@/lib/code-generator";
import { 
  validateFormStructure,
  type FormValidationResult
} from "@/lib/form-validator";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { CanvasGrid } from "@/components/canvas-grid";
import { BreakpointSwitcher } from "@/components/breakpoint-switcher";
import { HistoryControls } from "@/components/history-controls";
import { CollaborationMenu } from "@/components/collaboration-menu";

const INITIAL_STATE = {
  elements: [],
  history: [[]],
  historyIndex: 0,
  selectedElement: null,
  layout: "free" as FormLayout,
  breakpoint: "desktop" as FormBreakpoint,
  gridSize: 12,
  snapToGrid: true,
  lockedElements: [],
  groupedElements: [],
  validationErrors: new Map<string, string>()
};

const FormBuilder = () => {
  const [state, dispatch] = useReducer(formReducer, INITIAL_STATE);
  const [isDirty, setIsDirty] = useLocalStorage("form-builder-dirty", false);
  const { toast } = useToast();
  const { setNodeRef } = useDroppable({ id: "canvas-drop-area" });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );

  // Throttled auto-save
  const autoSave = useThrottledCallback(() => {
    if (isDirty) {
      dispatch({ type: "SAVE_FORM" });
      setIsDirty(false);
      toast({ title: "Auto-saved successfully", status: "success" });
    }
  }, 5000);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
    }
  };

  const handleAddElement = useCallback((type: ElementType) => {
    dispatch({ type: "ADD_ELEMENT", elementType: type });
    toast({ title: `Added ${type} element` });
  }, []);

  const handleSelectElement = useCallback((element: FormElementInstance | null) => {
    dispatch({ type: "SELECT_ELEMENT", element });
  }, []);

  const handleUpdateElement = useCallback((id: string, updates: Partial<FormElement>) => {
    dispatch({ type: "UPDATE_ELEMENT", id, updates });
    setIsDirty(true);
  }, []);

  const handleDeleteElement = useCallback((id: string) => {
    dispatch({ type: "DELETE_ELEMENT", id });
    toast({ title: "Element deleted" });
    setIsDirty(true);
  }, []);

  const handleDuplicateElement = useCallback((id: string) => {
    dispatch({ type: "DUPLICATE_ELEMENT", id });
    toast({ title: "Element duplicated" });
    setIsDirty(true);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!active || !over) return;

    if (active.id === over.id) return;

    const oldIndex = state.elements.findIndex(el => el.id === active.id);
    const newIndex = state.elements.findIndex(el => el.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newElements = arrayMove(state.elements, oldIndex, newIndex);
    dispatch({ type: "REORDER_ELEMENTS", elements: newElements });
    setIsDirty(true);
  }, [state.elements]);

  const handleLayoutChange = useCallback((newLayout: FormLayout) => {
    dispatch({ type: "CHANGE_LAYOUT", layout: newLayout });
  }, []);

  const handleBreakpointChange = useCallback((breakpoint: FormBreakpoint) => {
    dispatch({ type: "CHANGE_BREAKPOINT", breakpoint });
  }, []);

  const handleValidation = useCallback(() => {
    const result = validateFormStructure(state.elements);
    if (!result.isValid) {
      dispatch({ type: "SET_VALIDATION_ERRORS", errors: result.errors });
      toast({
        title: "Form validation failed",
        description: result.errors.size > 0 
          ? `${result.errors.size} errors found` 
          : "Unknown error",
        status: "error"
      });
      return false;
    }
    dispatch({ type: "CLEAR_VALIDATION_ERRORS" });
    return true;
  }, [state.elements]);

  const handlePreview = useCallback(() => {
    if (handleValidation()) {
      dispatch({ type: "TOGGLE_PREVIEW", preview: true });
    }
  }, [handleValidation]);

  const handleCodeExport = useCallback(async (format: 'react' | 'html') => {
    if (!handleValidation()) return;

    try {
      switch (format) {
        case 'react':
          await exportAsReactComponent(state.elements);
          break;
        case 'html':
          await exportAsHTML(state.elements);
          break;
      }
      toast({ title: `Exported as ${format.toUpperCase()} successfully`, status: "success" });
    } catch (error) {
      toast({ 
        title: "Export failed", 
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error"
      });
    }
  }, [state.elements, handleValidation]);

  if (state.preview) {
    return (
      <FormPreview 
        elements={state.elements}
        onExit={() => dispatch({ type: "TOGGLE_PREVIEW", preview: false })}
      />
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)] relative">
      <KeyboardShortcuts
        onUndo={() => dispatch({ type: "UNDO" })}
        onRedo={() => dispatch({ type: "REDO" })}
        onSave={() => dispatch({ type: "SAVE_FORM" })}
        onCopy={() => handleDuplicateElement(state.selectedElement?.id || '')}
        onDelete={() => handleDeleteElement(state.selectedElement?.id || '')}
      />

      <CollaborationMenu
        onShare={() => {/* Implement sharing logic */}}
        onComment={() => {/* Implement comments */}}
        onVersionHistory={() => {/* Implement version history */}}
      />

      {/* Left Sidebar */}
      <div className="col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden flex flex-col">
        <ComponentsSidebar 
          onAddElement={handleAddElement}
          breakpoint={state.breakpoint}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="col-span-8 flex flex-col relative">
        <div className="bg-card rounded-lg shadow-sm border mb-4 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BreakpointSwitcher
                breakpoint={state.breakpoint}
                onChange={handleBreakpointChange}
              />
              
              <Tooltip content="Free layout">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLayoutChange("free")}
                  active={state.layout === "free"}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </Tooltip>

              <Tooltip content="Grid system">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLayoutChange("grid")}
                  active={state.layout === "grid"}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
              </Tooltip>

              <CanvasGrid
                gridSize={state.gridSize}
                onGridSizeChange={(size) => 
                  dispatch({ type: "CHANGE_GRID_SIZE", size })
                }
                snapToGrid={state.snapToGrid}
                onSnapToggle={(snap) => 
                  dispatch({ type: "TOGGLE_SNAP", snap })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <HistoryControls
                canUndo={state.historyIndex > 0}
                canRedo={state.historyIndex < state.history.length - 1}
                onUndo={() => dispatch({ type: "UNDO" })}
                onRedo={() => dispatch({ type: "REDO" })}
              />

              <Button
                variant="outline"
                onClick={handlePreview}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Preview
              </Button>

              <Button
                variant="outline"
                onClick={() => handleCodeExport('react')}
                leftIcon={<Code className="h-4 w-4" />}
              >
                Export
              </Button>

              <Button
                variant="solid"
                onClick={() => dispatch({ type: "SAVE_FORM" })}
                leftIcon={<Save className="h-4 w-4" />}
                loading={state.isSaving}
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        <div 
          ref={setNodeRef}
          className="bg-canvas rounded-lg shadow-sm border flex-grow overflow-auto relative"
        >
          <DndContext
            sensors={sensors}
            modifiers={[restrictToParentElement, snapCenterToCursor]}
            collisionDetection={closestCenter}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always }}}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={state.elements}
              strategy={verticalListSortingStrategy}
            >
              <FormCanvas
                elements={state.elements}
                selectedElement={state.selectedElement}
                layout={state.layout}
                gridSize={state.gridSize}
                snapToGrid={state.snapToGrid}
                breakpoint={state.breakpoint}
                validationErrors={state.validationErrors}
                onSelect={handleSelectElement}
                onUpdate={handleUpdateElement}
                onDelete={handleDeleteElement}
                onDuplicate={handleDuplicateElement}
              />
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="col-span-2 bg-card rounded-lg shadow-sm border overflow-hidden flex flex-col">
        <PropertiesPanel
          selectedElement={state.selectedElement}
          breakpoint={state.breakpoint}
          validationErrors={state.validationErrors}
          onUpdate={handleUpdateElement}
          onLock={(id) => dispatch({ type: "TOGGLE_LOCK", id })}
          onGroup={(ids) => dispatch({ type: "GROUP_ELEMENTS", ids })}
        />
      </div>
    </div>
  );
};

export default FormBuilder;
