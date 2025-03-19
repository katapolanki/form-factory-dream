
import { useRef, useState } from "react";
import { FormElement } from "./FormBuilder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormElementRendererProps {
  element: FormElement;
  onDrag?: (deltaX: number, deltaY: number) => void;
}

const FormElementRenderer = ({ element, onDrag }: FormElementRendererProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onDrag) return;
    
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    
    const handleMouseMove = (event: MouseEvent) => {
      const deltaX = event.clientX - startPosRef.current.x;
      const deltaY = event.clientY - startPosRef.current.y;
      
      onDrag(deltaX, deltaY);
      
      startPosRef.current = { x: event.clientX, y: event.clientY };
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    e.preventDefault();
  };
  
  // Common style for all elements
  const commonStyle = {
    width: element.style?.width || "100%",
    backgroundColor: element.style?.backgroundColor || "transparent",
    color: element.style?.textColor || "",
    borderRadius: element.style?.borderRadius || "0.375rem",
    padding: element.style?.padding || "0.5rem",
    fontSize: element.style?.fontSize || "1rem",
    fontWeight: element.style?.fontWeight || "normal",
  };
  
  const renderElement = () => {
    switch (element.type) {
      case "heading":
        return (
          <h2 style={commonStyle}>{element.content}</h2>
        );
        
      case "paragraph":
        return (
          <p style={commonStyle}>{element.content}</p>
        );
        
      case "input":
        return (
          <div className="space-y-2 w-full">
            <Label>{element.content}</Label>
            <Input 
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
            />
          </div>
        );
        
      case "textarea":
        return (
          <div className="space-y-2 w-full">
            <Label>{element.content}</Label>
            <Textarea 
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
            />
          </div>
        );
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={`checkbox-${element.id}`} required={element.required} />
            <Label htmlFor={`checkbox-${element.id}`} style={commonStyle}>
              {element.content}
            </Label>
          </div>
        );
        
      case "radio":
        return (
          <div className="space-y-2 w-full">
            <Label>{element.content}</Label>
            <RadioGroup>
              {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${element.id}-${index}`} />
                  <Label htmlFor={`radio-${element.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
        
      case "select":
        return (
          <div className="space-y-2 w-full">
            <Label>{element.content}</Label>
            <Select>
              <SelectTrigger style={commonStyle}>
                <SelectValue placeholder={element.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
        
      case "button":
        return (
          <Button style={commonStyle}>
            {element.content}
          </Button>
        );
        
      case "divider":
        return (
          <div className="w-full my-2 border-t" style={commonStyle}></div>
        );
        
      case "spacer":
        return (
          <div style={{ ...commonStyle, height: element.style?.padding || "1rem" }}></div>
        );
        
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };
  
  return (
    <div 
      className={`${onDrag ? 'cursor-move' : ''} ${isDragging ? 'opacity-70' : ''}`}
      onMouseDown={handleMouseDown}
    >
      {renderElement()}
    </div>
  );
};

export default FormElementRenderer;
