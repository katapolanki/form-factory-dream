import { useCallback, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormElement, ElementType } from "./types";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Label,
  Input,
  Textarea,
  Select,
  Switch,
  Button,
  ColorPicker,
  Slider,
  Tooltip,
  CodePreview,
  Icon,
  Badge
} from "@/components/ui";
import { 
  styleSchema,
  layoutSchema,
  validationSchema,
  a11ySchema
} from "@/schemas/element-properties";
import { 
  useDebouncedUpdate,
  useElementContextMenu,
  useStylePreview
} from "@/hooks";
import { 
  cssVariables,
  spacingScale,
  radiusScale,
  typographyScale
} from "@/lib/design-tokens";

interface PropertiesPanelProps {
  selectedElement: FormElement | null;
  onUpdate: (updates: Partial<FormElement>) => void;
}

const PropertySection = ({ title, children, tooltip }) => (
  <div className="space-y-4 p-4 border-b">
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium">{title}</Label>
      {tooltip && <Tooltip content={tooltip}><Icon name="info" className="h-4 w-4" /></Tooltip>}
    </div>
    {children}
  </div>
);

const PropertiesPanel = ({ selectedElement, onUpdate }: PropertiesPanelProps) => {
  const { register, formState: { errors }, trigger } = useFormContext();
  const { debouncedUpdate } = useDebouncedUpdate(onUpdate, 300);
  const { previewStyles, updatePreview } = useStylePreview();

  const handleUpdate = useCallback((path: string, value: any) => {
    debouncedUpdate({ [path]: value });
    if (path.startsWith('style')) updatePreview(path.split('.')[1], value);
  }, [debouncedUpdate, updatePreview]);

  const renderContentTab = useMemo(() => {
    if (!selectedElement) return null;
    
    return (
      <>
        <PropertySection title="Content" tooltip="Main content and labels">
          <Input
            label="Element Label"
            {...register('content', { 
              required: "Label is required",
              maxLength: 50 
            })}
            error={errors.content?.message}
          />
          <Input
            label="Placeholder Text"
            {...register('placeholder')}
          />
        </PropertySection>

        {['select', 'radio', 'checkbox'].includes(selectedElement.type) && (
          <PropertySection title="Options" tooltip="List of selectable options">
            <Textarea
              label="Options (one per line)"
              {...register('options')}
              parse={(value) => value.split('\n').filter(Boolean)}
              format={(value) => value?.join('\n') || ''}
            />
          </PropertySection>
        )}
      </>
    );
  }, [selectedElement, register, errors]);

  const renderStyleTab = useMemo(() => (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="space-y-4">
        <Input
          label="Width"
          type="select"
          options={cssVariables.width}
          {...register('style.width')}
        />
        <Input
          label="Padding"
          type="range"
          min={0}
          max={spacingScale.length - 1}
          step={1}
          {...register('style.padding', {
            setValueAs: (v) => spacingScale[Number(v)]
          })}
        />
        <Input
          label="Border Radius"
          type="range"
          min={0}
          max={radiusScale.length - 1}
          step={1}
          {...register('style.borderRadius', {
            setValueAs: (v) => radiusScale[Number(v)]
          })}
        />
      </div>
      
      <div className="space-y-4">
        <ColorPicker
          label="Text Color"
          {...register('style.color')}
          onChange={(color) => handleUpdate('style.color', color)}
        />
        <ColorPicker
          label="Background Color"
          {...register('style.backgroundColor')}
          onChange={(color) => handleUpdate('style.backgroundColor', color)}
        />
        <Input
          label="Font Size"
          type="select"
          options={typographyScale.fontSize}
          {...register('style.fontSize')}
        />
      </div>
      
      <CodePreview 
        className="col-span-2 mt-4" 
        code={previewStyles} 
        language="css" 
      />
    </div>
  ), [register, previewStyles, handleUpdate]);

  const renderAdvancedTab = useMemo(() => (
    <div className="p-4 space-y-4">
      <PropertySection title="Conditional Logic">
        <Input
          label="Visibility Condition"
          {...register('conditional.visible')}
          placeholder="e.g. {formState.age > 18}"
        />
      </PropertySection>

      <PropertySection title="Custom Validation">
        <Textarea
          label="Validation Rules"
          {...register('validation.rules')}
          rows={4}
        />
        <Input
          label="Custom Error Message"
          {...register('validation.message')}
        />
      </PropertySection>

      <PropertySection title="Data Binding">
        <Input
          label="API Field Name"
          {...register('dataBinding.field')}
        />
        <Input
          label="Data Transformation"
          {...register('dataBinding.transform')}
        />
      </PropertySection>
    </div>
  ), [register]);

  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center">
        <Icon name="select" className="h-8 w-8 mx-auto mb-4" />
        <p className="text-muted-foreground">Select an element to edit properties</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Badge variant="element-type">{selectedElement.type}</Badge>
          <h3 className="font-semibold truncate">{selectedElement.name}</h3>
        </div>
      </header>

      <Tabs defaultValue="content" className="flex-1 overflow-auto">
        <TabsList className="grid grid-cols-4 h-12 rounded-none">
          <TabsTrigger value="content">
            <Icon name="edit" className="mr-2" /> Content
          </TabsTrigger>
          <TabsTrigger value="style">
            <Icon name="palette" className="mr-2" /> Style
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Icon name="settings" className="mr-2" /> Advanced
          </TabsTrigger>
          <TabsTrigger value="code">
            <Icon name="code" className="mr-2" /> Code
          </TabsTrigger>
        </TabsList>

        <div className="h-[calc(100vh-180px)] overflow-y-auto">
          <TabsContent value="content">{renderContentTab}</TabsContent>
          <TabsContent value="style">{renderStyleTab}</TabsContent>
          <TabsContent value="advanced">{renderAdvancedTab}</TabsContent>
          <TabsContent value="code">
            <CodePreview
              code={JSON.stringify(selectedElement, null, 2)}
              language="json"
              className="p-4"
            />
          </TabsContent>
        </div>
      </Tabs>

      <footer className="p-4 border-t flex justify-between">
        <Button variant="ghost" onClick={() => onUpdate({ visible: !selectedElement.visible })}>
          <Icon name={selectedElement.visible ? "eye" : "eye-off"} className="mr-2" />
          {selectedElement.visible ? "Hide" : "Show"}
        </Button>
        <Button onClick={() => trigger()}>
          <Icon name="save" className="mr-2" /> Save Changes
        </Button>
      </footer>
    </div>
  );
};

export default PropertiesPanel;
