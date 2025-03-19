
import { FormElement } from "./FormBuilder";
import FormElementRenderer from "./FormElementRenderer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormPreviewProps {
  elements: FormElement[];
}

const FormPreview = ({ elements }: FormPreviewProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-lg border p-8">
      <h2 className="text-2xl font-bold mb-6">Form Preview</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {elements.map((element) => (
          <div key={element.id} className="w-full">
            <FormElementRenderer element={element} />
          </div>
        ))}
        
        {elements.length > 0 && (
          <div className="pt-4">
            <Button type="submit" className="mr-2">Submit</Button>
            <Button type="reset" variant="outline">Reset</Button>
          </div>
        )}
        
        {elements.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No form elements added yet.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormPreview;
