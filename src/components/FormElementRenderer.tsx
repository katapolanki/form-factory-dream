import { useMemo, useCallback, useEffect, forwardRef } from "react";
import { useFormContext, useController } from "react-hook-form";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { tv, type VariantProps } from "tailwind-variants";
import { 
  Input,
  Textarea,
  Button,
  Label,
  Checkbox,
  RadioGroup,
  Select,
  Accordion,
  Alert,
  Avatar,
  Badge,
  AspectRatio,
  Calendar,
  DropdownMenu,
  Popover,
  Tooltip,
  Skeleton
} from "@/components/ui";
import { 
  InfoIcon, 
  ChevronDown, 
  AlertCircle,
  GripVertical,
  Lock,
  Unlock
} from "lucide-react";
import { 
  DatePicker,
  ColorPicker,
  IconSelector,
  ResponsiveControls 
} from "@/components/advanced";
import { 
  type FormElementInstance,
  type CustomComponentProps,
  ElementTypes,
  type ValidationRules
} from "@/types";
import { useFormValidation } from "@/hooks/use-form-validation";
import { cn } from "@/lib/utils";

const elementStyles = tv({
  base: "relative group",
  variants: {
    state: {
      selected: "ring-2 ring-primary ring-offset-2",
      locked: "opacity-50 cursor-not-allowed",
      error: "ring-2 ring-destructive",
      hidden: "hidden"
    },
    layout: {
      free: "absolute",
      grid: "static",
      flex: "static"
    }
  }
});

interface FormElementRendererProps 
  extends CustomComponentProps,
    VariantProps<typeof elementStyles> {
  element: FormElementInstance;
  isBuilderMode?: boolean;
  isDragging?: boolean;
  validationRules?: ValidationRules;
}

const FormElementRenderer = forwardRef<HTMLDivElement, FormElementRendererProps>(
  ({ 
    element,
    isBuilderMode = false,
    isDragging = false,
    state,
    layout,
    validationRules,
    className,
    style,
    ...props
  }, ref) => {
    const { control } = useFormContext();
    const { validateElement, getValidationStatus } = useFormValidation();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: element.id,
      disabled: !isBuilderMode || element.locked
    });

    const { field } = useController({
      name: element.name || element.id,
      control,
      rules: validationRules,
      defaultValue: element.defaultValue
    });

    const transformStyle = useMemo(() => ({
      transform: CSS.Translate.toString(transform),
      zIndex: isDragging ? 100 : element.zIndex,
      ...style
    }), [transform, isDragging, element.zIndex, style]);

    const validationStatus = useMemo(() => 
      getValidationStatus(element.id), 
      [element.id, getValidationStatus]
    );

    const handleValidation = useCallback(() => {
      if (!validationRules) return;
      return validateElement(element.id, field.value, validationRules);
    }, [element.id, field.value, validationRules, validateElement]);

    useEffect(() => {
      if (element.validateOnMount) {
        handleValidation();
      }
    }, []);

    const renderLabel = useCallback((label: string) => (
      <div className="flex items-center justify-between mb-2">
        <Label className="font-medium text-foreground">
          {label}
          {element.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
        {element.tooltip && (
          <Tooltip content={element.tooltip}>
            <InfoIcon className="h-4 w-4 text-muted-foreground ml-2" />
          </Tooltip>
        )}
      </div>
    ), [element.required, element.tooltip]);

    const renderValidationError = useCallback(() => {
      if (!validationStatus?.isValid) {
        return (
          <div className="text-destructive text-sm mt-1 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {validationStatus?.message}
          </div>
        );
      }
    }, [validationStatus]);

    const renderElement = useCallback(() => {
      switch (element.type) {
        case ElementTypes.TEXT_INPUT:
          return (
            <div className="w-full">
              {element.label && renderLabel(element.label)}
              <Input
                {...field}
                placeholder={element.placeholder}
                disabled={element.disabled}
                onBlur={(e) => {
                  field.onBlur();
                  if (element.validateOnBlur) handleValidation();
                }}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  if (element.validateOnChange) handleValidation();
                }}
              />
              {renderValidationError()}
            </div>
          );

        case ElementTypes.DATE_PICKER:
          return (
            <div className="w-full">
              {element.label && renderLabel(element.label)}
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                disabled={element.disabled}
              />
              {renderValidationError()}
            </div>
          );

        case ElementTypes.COLOR_PICKER:
          return (
            <div className="w-full">
              {element.label && renderLabel(element.label)}
              <ColorPicker
                value={field.value}
                onChange={field.onChange}
                disabled={element.disabled}
              />
              {renderValidationError()}
            </div>
          );

        // További elemek...

        default:
          return (
            <div className="text-destructive">
              Unknown element type: {element.type}
            </div>
          );
      }
    }, [element, field, handleValidation, renderLabel, renderValidationError]);

    return (
      <div
        ref={ref}
        className={cn(
          elementStyles({ state, layout, className }),
          element.customClassName
        )}
        style={transformStyle}
        data-element-id={element.id}
        data-element-type={element.type}
        {...props}
      >
        {isBuilderMode && (
          <div className="absolute top-0 left-0 -translate-x-full pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              ref={setNodeRef}
              className="text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <Tooltip content={element.locked ? "Unlock" : "Lock"}>
              <button
                className="text-muted-foreground hover:text-foreground ml-1"
                onClick={() => /* Toggle lock state */}
              >
                {element.locked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </button>
            </Tooltip>
          </div>
        )}

        {element.isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          renderElement()
        )}

        {isBuilderMode && element.responsiveSettings && (
          <ResponsiveControls
            settings={element.responsiveSettings}
            onUpdate={(settings) => /* Update responsive settings */}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
    );
  }
);

FormElementRenderer.displayName = "FormElementRenderer";

export default FormElementRenderer;
