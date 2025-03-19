import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  toast,
  Separator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui";
import { icons } from "lucide-react";
import { CodeEditor } from "@/components/code-editor";
import { cn } from "@/lib/utils";
import { sanitizeJSX } from "@/lib/sanitizer";
import { ComponentTemplateSelector } from "./ComponentTemplateSelector";
import { IconPicker } from "./IconPicker";

const componentSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9\s-]+$/, "Invalid component name"),
  description: z.string().max(200).optional(),
  category: z.enum(["layout", "input", "display", "custom", "integration"]),
  icon: z.string().min(1, "Icon is required"),
  markup: z.string()
    .min(10, "Markup must be at least 10 characters")
    .refine((val) => isValidJSX(val), "Invalid JSX syntax"),
  props: z.array(z.object({
    name: z.string(),
    type: z.enum(["string", "number", "boolean", "object", "function"]),
    defaultValue: z.string().optional()
  })).optional(),
  styling: z.enum(["tailwind", "css", "scss", "styled-components"]).default("tailwind"),
  isPublic: z.boolean().default(false)
});

type FormValues = z.infer<typeof componentSchema>;

interface CreateCustomComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (component: CustomComponentData) => void;
  loading?: boolean;
}

export interface CustomComponentData {
  id: string;
  name: string;
  description?: string;
  category: string;
  icon: string;
  markup: string;
  props?: ComponentProp[];
  styling: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ComponentProp {
  name: string;
  type: string;
  defaultValue?: string;
}

const CreateCustomComponent = ({ open, onOpenChange, onSave }: CreateCustomComponentProps) => {
  const [tab, setTab] = useState("form");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [templates] = useState([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(componentSchema),
    defaultValues: {
      category: "custom",
      styling: "tailwind",
      isPublic: false
    }
  });

  const handleTemplateSelect = useCallback((template: any) => {
    form.reset(template);
    setTab("form");
  }, [form]);

  const validateJSX = useCallback(async (jsx: string) => {
    try {
      setIsValidating(true);
      // Implement real JSX validation logic here
      await sanitizeJSX(jsx);
      return true;
    } catch (error) {
      return "Invalid JSX syntax or dangerous content detected";
    } finally {
      setIsValidating(false);
    }
  }, []);

  const updatePreview = useCallback((markup: string) => {
    try {
      // Implement safe preview rendering
      const cleanMarkup = sanitizeJSX(markup);
      setPreviewHtml(cleanMarkup);
    } catch (error) {
      setPreviewHtml("<div class='text-destructive'>Error in preview markup</div>");
    }
  }, []);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.markup) {
        updatePreview(value.markup);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updatePreview]);

  const onSubmit = async (data: FormValues) => {
    try {
      const componentData: CustomComponentData = {
        ...data,
        id: `custom-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      onSave(componentData);
      form.reset();
      onOpenChange(false);
      toast.success("Component saved", {
        description: `${data.name} is now available in your library`
      });
    } catch (error) {
      toast.error("Failed to save component", {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Custom Component</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="form">Component Builder</TabsTrigger>
            <TabsTrigger value="preview">Live Preview</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              <TabsContent value="form" className="flex-1 overflow-auto">
                <div className="grid grid-cols-2 gap-6 p-4">
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="MyCustomComponent" 
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormDescription>
                          Use PascalCase for component names
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Icon Picker */}
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <IconPicker value={field.value} onChange={field.onChange} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Selector */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="layout">Layout</SelectItem>
                            <SelectItem value="input">Input</SelectItem>
                            <SelectItem value="display">Display</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                            <SelectItem value="integration">Integration</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Styling Method */}
                  <FormField
                    control={form.control}
                    name="styling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Styling Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select styling method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                            <SelectItem value="css">Plain CSS</SelectItem>
                            <SelectItem value="scss">SCSS</SelectItem>
                            <SelectItem value="styled-components">Styled Components</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* JSX Editor */}
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="markup"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Component Markup</FormLabel>
                          <FormControl>
                            <CodeEditor
                              value={field.value}
                              onChange={field.onChange}
                              language="jsx"
                              className="h-96"
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormDescription>
                            Use valid JSX syntax. Props are accessible via `props` object.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
                <div className="rounded-lg border p-4">
                  <div 
                    className="prose dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                  {!previewHtml && (
                    <div className="text-muted-foreground text-center py-8">
                      Write some JSX to see the preview
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="templates" className="p-4">
                <ComponentTemplateSelector 
                  templates={templates}
                  onSelect={handleTemplateSelect}
                />
              </TabsContent>

              <DialogFooter className="border-t pt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  type="submit"
                  disabled={!form.formState.isValid || isValidating}
                  loading={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Saving..." : "Save Component"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Helper function for JSX validation
const isValidJSX = (code: string) => {
  try {
    // Basic JSX validation - replace with proper parser
    return code.trim().startsWith("<") && code.trim().endsWith(">");
  } catch {
    return false;
  }
};

export default CreateCustomComponent;
