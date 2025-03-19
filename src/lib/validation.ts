// validation.ts
import { z } from "zod";
import { isValidUUID, validateColorFormat } from "./utils";

// Közös típusok és konstansok
export const POSITION_TYPES = ["static", "relative", "absolute", "fixed"] as const;
export const ALIGN_TYPES = ["left", "center", "right", "justify"] as const;
export const SIZE_TYPES = ["xs", "small", "default", "large", "xl"] as const;
export const WIDTH_UNITS = ["px", "%", "rem", "em"] as const;

// Alapstílus séma részletes validációval
const baseStyleSchema = z.object({
  width: z.string().regex(/^\d+(\.\d+)?(%|px|rem|em)$/, "Invalid width format"),
  backgroundColor: z.string().refine(validateColorFormat, "Invalid color format"),
  textColor: z.string().refine(validateColorFormat, "Invalid color format"),
  borderWidth: z.string().regex(/^\d+px$/, "Invalid border width"),
  borderStyle: z.enum(["none", "solid", "dashed", "dotted", "double"]),
  borderColor: z.string().refine(validateColorFormat, "Invalid color format"),
  borderRadius: z.string().regex(/^\d+px$/, "Invalid border radius"),
  padding: z.string().regex(/^\d+px$/, "Invalid padding format"),
  fontSize: z.string().regex(/^\d+(\.\d+)?(px|rem)$/, "Invalid font size"),
  fontWeight: z.enum(["normal", "medium", "bold", "black"]),
  opacity: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 1;
  }, "Opacity must be between 0 and 1"),
});

// Pozíció séma részletes validációval
const positionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  type: z.enum(POSITION_TYPES).default("static"),
  top: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  left: z.string().optional(),
  zIndex: z.string().regex(/^\d+$/, "Z-index must be a number").optional(),
  align: z.enum(ALIGN_TYPES).optional(),
  gridColumn: z.string().regex(/^\d+\/\d+$/, "Invalid grid column format").optional(),
  gridRow: z.string().regex(/^\d+\/\d+$/, "Invalid grid row format").optional(),
  hideMobile: z.boolean().default(false),
  hideTablet: z.boolean().default(false),
  hideDesktop: z.boolean().default(false),
});

// Alap elem séma részletes validációval
export const baseElementSchema = z.object({
  id: z.string().refine(isValidUUID, "Invalid UUID format"),
  type: z.string().nonempty("Element type is required"),
  content: z.string().max(500, "Content too long").optional(),
  isSelected: z.boolean().default(false),
  hidden: z.boolean().default(false),
  customClass: z.string().max(50, "Class name too long").optional(),
  position: positionSchema.optional(),
  style: baseStyleSchema.optional(),
  width: z.enum(["full", "medium", "small", "tiny", "custom"]).default("full"),
  customWidth: z.string().optional(),
  customWidthUnit: z.enum(WIDTH_UNITS).default("px"),
  size: z.enum(SIZE_TYPES).default("default"),
  labelPosition: z.enum(["top", "left", "right", "bottom", "hidden"]).default("top"),
  textAlign: z.enum(ALIGN_TYPES).default("left"),
});

// Validációs helper függvények
const validateMinMax = (schema: z.ZodTypeAny, field: string) => (
  schema.refine(data => {
    if (data.min !== undefined && data.max !== undefined) {
      return data.max > data.min;
    }
    return true;
  }, `${field} max must be greater than min`)
);

// Input elemek közös sémája
const inputBaseSchema = baseElementSchema.extend({
  placeholder: z.string().max(100, "Placeholder too long").optional(),
  required: z.boolean().default(false),
  helpText: z.string().max(200, "Help text too long").optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  validateOnBlur: z.boolean().default(true),
  validateOnChange: z.boolean().default(false),
  customValidation: z.string().max(500, "Validation code too long").optional(),
});

// Szöveg input séma
export const textInputSchema = validateMinMax(
  inputBaseSchema.extend({
    type: z.literal("text"),
    minLength: z.number().int().min(0).max(1000).optional(),
    maxLength: z.number().int().min(1).max(1000).optional(),
    pattern: z.string().regex(/^\/(?:[^/\\]|\\.)*\/[gimuy]*$/, "Invalid regex pattern").optional(),
  }),
  'TextInput'
);

// Szám input séma
export const numberInputSchema = validateMinMax(
  inputBaseSchema.extend({
    type: z.literal("number"),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().positive("Step must be positive").optional(),
  }),
  'NumberInput'
);

// Textarea séma
export const textareaSchema = inputBaseSchema.extend({
  type: z.literal("textarea"),
  rows: z.number().int().min(1).max(20).default(3),
  resizable: z.enum(["none", "vertical", "horizontal", "both"]).default("vertical"),
});

// Egyéb elem sémák...
// (Checkbox, Radio, Select, Button stb.)

// Form séma részletes validációval
export const formSchema = z.object({
  id: z.string().refine(isValidUUID, "Invalid UUID format"),
  name: z.string().min(3, "Name too short").max(50, "Name too long"),
  description: z.string().max(200, "Description too long").optional(),
  elements: z.array(baseElementSchema).superRefine((elements, ctx) => {
    const ids = new Set<string>();
    for (const [index, element] of elements.entries()) {
      if (ids.has(element.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate element ID: ${element.id}`,
          path: [index, 'id']
        });
      }
      ids.add(element.id);
    }
  }),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});

// Elem típusok union sémája
export type FormElement = z.infer<typeof baseElementSchema>;
export type FormSchema = z.infer<typeof formSchema>;

// Validációs helper függvény
export function validateElement<T extends FormElement>(element: T) {
  const schemas = {
    text: textInputSchema,
    number: numberInputSchema,
    textarea: textareaSchema,
    // ...egyéb elem típusok
  };
  
  const schema = schemas[element.type as keyof typeof schemas] ?? baseElementSchema;
  return schema.safeParse(element);
}
