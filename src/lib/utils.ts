form-factory-dream/src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

form-factory-dream/src/lib/validation.ts


import { z } from "zod";
import { ElementType } from "@/components/FormBuilder";

// Base schema for all form elements
export const baseElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string().optional(),
  isSelected: z.boolean().optional(),
  hidden: z.boolean().optional(),
  customClass: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    type: z.enum(["static", "relative", "absolute", "fixed"]).optional(),
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
    zIndex: z.string().optional(),
    align: z.enum(["left", "center", "right"]).optional(),
    gridColumn: z.string().optional(),
    gridRow: z.string().optional(),
    hideMobile: z.boolean().optional(),
    hideTablet: z.boolean().optional(),
    hideDesktop: z.boolean().optional(),
  }).optional(),
  style: z.object({
    width: z.string().optional(),
    backgroundColor: z.string().optional(),
    textColor: z.string().optional(),
    borderWidth: z.string().optional(),
    borderStyle: z.string().optional(),
    borderColor: z.string().optional(),
    borderRadius: z.string().optional(),
    padding: z.string().optional(),
    paddingY: z.string().optional(),
    paddingX: z.string().optional(),
    marginY: z.string().optional(),
    marginX: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    lineHeight: z.string().optional(),
    letterSpacing: z.string().optional(),
    opacity: z.string().optional(),
    shadow: z.string().optional(),
  }).optional(),
  width: z.enum(["full", "medium", "small", "tiny", "custom"]).optional(),
  customWidth: z.string().optional(),
  customWidthUnit: z.enum(["px", "%", "rem", "em"]).optional(),
  size: z.enum(["xs", "small", "default", "large", "xl"]).optional(),
  labelPosition: z.enum(["top", "left", "right", "bottom", "hidden"]).optional(),
  textAlign: z.enum(["left", "center", "right", "justify"]).optional(),
});

// Input element schema
export const inputElementSchema = baseElementSchema.extend({
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  helpText: z.string().optional(),
  defaultValue: z.union([z.string(), z.number()]).optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
  inputMode: z.string().optional(),
  autocomplete: z.string().optional(),
  validateOnBlur: z.boolean().optional(),
  validateOnChange: z.boolean().optional(),
  customValidation: z.string().optional(),
});

// Number input element schema
export const numberElementSchema = inputElementSchema.extend({
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
});

// Textarea element schema
export const textareaElementSchema = inputElementSchema.extend({
  rows: z.number().optional(),
  resizable: z.enum(["none", "vertical", "horizontal", "both"]).optional(),
});

// Checkbox element schema
export const checkboxElementSchema = baseElementSchema.extend({
  required: z.boolean().optional(),
  helpText: z.string().optional(),
  defaultChecked: z.boolean().optional(),
  checkboxPosition: z.enum(["left", "right"]).optional(),
});

// Button element schema
export const buttonElementSchema = baseElementSchema.extend({
  buttonVariant: z.string().optional(),
  buttonType: z.string().optional(),
  icon: z.string().optional(),
  iconPosition: z.string().optional(),
});

// Radio element schema
export const radioElementSchema = baseElementSchema.extend({
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  helpText: z.string().optional(),
});

// Select element schema
export const selectElementSchema = baseElementSchema.extend({
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
});

// Helper function to validate element based on type
export function validateElement(element: any) {
  switch (element.type) {
    case "input":
    case "text":
      return inputElementSchema.safeParse(element);
    case "number":
      return numberElementSchema.safeParse(element);
    case "textarea":
      return textareaElementSchema.safeParse(element);
    case "checkbox":
      return checkboxElementSchema.safeParse(element);
    case "button":
      return buttonElementSchema.safeParse(element);
    case "radio":
      return radioElementSchema.safeParse(element);
    case "select":
      return selectElementSchema.safeParse(element);
    default:
      return baseElementSchema.safeParse(element);
  }
}

// Form schema for validating the entire form structure
export const formSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  elements: z.array(baseElementSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
