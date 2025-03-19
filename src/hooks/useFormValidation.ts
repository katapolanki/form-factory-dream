import { useEffect, useCallback, useState } from "react";
import { z, ZodSchema } from "zod";
import { FormElement, ValidationResult } from "@/types";
import { safeEvaluate } from "@/lib/validation-utils";

type ValidationMode = "onChange" | "onBlur" | "onSubmit";

type Options = {
  mode?: ValidationMode;
  schema?: ZodSchema;
  crossFieldValidation?: Record<string, (values: any) => string | null>;
};

export function useAdvancedFormValidation<T extends Record<string, any>>(
  initialValues: T,
  options: Options = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(
    async (name: string, value: any) => {
      const element = initialValues[name] as FormElement;
      let error = null;

      // 1. Validate against Zod schema
      if (options.schema) {
        try {
          await options.schema.parseAsync({ [name]: value });
        } catch (err) {
          if (err instanceof z.ZodError) {
            error = err.errors[0].message;
          }
        }
      }

      // 2. Element-specific validation
      if (!error && element.validation) {
        const { required, minLength, maxLength, pattern, custom } = element.validation;

        if (required && !value) {
          error = "This field is required";
        } else if (minLength && value.length < minLength) {
          error = `Minimum ${minLength} characters required`;
        } else if (maxLength && value.length > maxLength) {
          error = `Maximum ${maxLength} characters allowed`;
        } else if (pattern && !new RegExp(pattern).test(value)) {
          error = "Invalid format";
        } else if (custom) {
          error = await safeEvaluate(custom, value, values);
        }
      }

      // 3. Cross-field validation
      if (!error && options.crossFieldValidation?.[name]) {
        error = options.crossFieldValidation[name](values);
      }

      setErrors(prev => ({ ...prev, [name]: error || "" }));
      return !error;
    },
    [initialValues, options.schema, options.crossFieldValidation, values]
  );

  const validateForm = useCallback(async () => {
    setIsValidating(true);
    const results = await Promise.all(
      Object.entries(values).map(([name, value]) =>
        validateField(name, value)
      )
    );
    setIsValidating(false);
    return results.every(Boolean);
  }, [values, validateField]);

  const handleChange = useCallback(
    async (name: string, value: any) => {
      setValues(prev => ({ ...prev, [name]: value }));
      if (options.mode === "onChange") {
        await validateField(name, value);
      }
    },
    [options.mode, validateField]
  );

  const handleBlur = useCallback(
    async (name: string) => {
      if (options.mode === "onBlur") {
        await validateField(name, values[name]);
      }
    },
    [options.mode, validateField, values]
  );

  useEffect(() => {
    if (options.mode === "onSubmit") {
      setErrors({});
    }
  }, [options.mode]);

  return {
    values,
    errors,
    isValid: Object.values(errors).every(error => !error),
    isValidating,
    setValues,
    handleChange,
    handleBlur,
    validateForm,
    reset: () => {
      setValues(initialValues);
      setErrors({});
    },
  };
}
