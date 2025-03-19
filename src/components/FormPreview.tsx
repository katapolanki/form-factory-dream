import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Stepper } from "@/components/ui/stepper";
import { useFormDesigner } from "@/hooks/use-form-designer";
import FormElementRenderer from "./FormElementRenderer";
import { formSchema } from "@/lib/form-schema";
import { cn } from "@/lib/utils";

const FormPreview = () => {
  const { elements, formConfig } = useFormDesigner();
  const [currentStep, setCurrentStep] = useState(0);
  const steps = formConfig?.steps || [{ title: "Step 1" }];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formConfig?.defaultValues
  });

  const handleSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Implement submission logic
  };

  return (
    <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-xl border p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{formConfig?.title || "Form Preview"}</h1>
        {formConfig?.description && (
          <p className="text-muted-foreground">{formConfig.description}</p>
        )}
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSubmit)} 
          className="space-y-8"
        >
          <div className="space-y-6">
            {elements
              .filter(el => el.step === currentStep)
              .map((element) => (
                <FormElementRenderer
                  key={element.id}
                  element={element}
                  isBuilderMode={false}
                  className={cn(
                    element.responsiveHidden?.mobile && "hidden sm:block",
                    element.responsiveHidden?.tablet && "hidden md:block",
                    element.responsiveHidden?.desktop && "hidden lg:block"
                  )}
                />
              ))}
          </div>

          <div className="flex justify-between pt-8">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormPreview;
