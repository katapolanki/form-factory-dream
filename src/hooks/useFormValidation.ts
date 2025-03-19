
import { useState } from "react";
import { FormElement } from "@/components/FormBuilder";
import { validateElement } from "@/lib/validation";
import { z } from "zod";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function useFormValidation() {
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});

  // Validate a single element
  const validateFormElement = (element: FormElement): ValidationResult => {
    // First check Zod schema validation
    const zodResult = validateElement(element);
    
    if (!zodResult.success) {
      const error = zodResult.error.issues[0]?.message || "Invalid element";
      return { valid: false, error };
    }
    
    // Then check specific validation rules based on element type
    if (element.required) {
      // Required field validation
      if (element.type === "input" || element.type === "text" || element.type === "textarea") {
        if (!element.defaultValue || element.defaultValue === "") {
          return { valid: false, error: "This field is required" };
        }
      } else if (element.type === "checkbox" && !element.defaultChecked) {
        return { valid: false, error: "This checkbox must be checked" };
      }
    }
    
    // Text length validation
    if ((element.type === "input" || element.type === "text" || element.type === "textarea") && 
        typeof element.defaultValue === "string") {
      if (element.minLength && element.defaultValue.length < element.minLength) {
        return { 
          valid: false, 
          error: `Input must be at least ${element.minLength} characters` 
        };
      }
      
      if (element.maxLength && element.defaultValue.length > element.maxLength) {
        return { 
          valid: false, 
          error: `Input must be no more than ${element.maxLength} characters` 
        };
      }
      
      // Pattern validation
      if (element.pattern && !new RegExp(element.pattern).test(element.defaultValue)) {
        return { valid: false, error: "Input format is invalid" };
      }
    }
    
    // Number range validation
    if (element.type === "number" && typeof element.defaultValue === "number") {
      if (element.min !== undefined && element.defaultValue < element.min) {
        return { 
          valid: false, 
          error: `Value must be at least ${element.min}` 
        };
      }
      
      if (element.max !== undefined && element.defaultValue > element.max) {
        return { 
          valid: false, 
          error: `Value must be no more than ${element.max}` 
        };
      }
    }
    
    // Custom validation
    if (element.customValidation) {
      try {
        // Be careful with eval - in a production app, you might want to use a safer approach
        const customValidationFn = new Function('value', `return ${element.customValidation}`);
        const isValid = customValidationFn(element.defaultValue);
        
        if (!isValid) {
          return { valid: false, error: "Custom validation failed" };
        }
      } catch (err) {
        console.error("Custom validation error:", err);
        return { valid: false, error: "Invalid custom validation" };
      }
    }
    
    return { valid: true };
  };
  
  // Validate all elements in a form
  const validateForm = (elements: FormElement[]): boolean => {
    const results: Record<string, ValidationResult> = {};
    let isFormValid = true;
    
    elements.forEach(element => {
      const result = validateFormElement(element);
      results[element.id] = result;
      
      if (!result.valid) {
        isFormValid = false;
      }
    });
    
    setValidationResults(results);
    return isFormValid;
  };
  
  return {
    validateElement: validateFormElement,
    validateForm,
    validationResults,
    getElementValidation: (elementId: string) => validationResults[elementId] || { valid: true }
  };
}
