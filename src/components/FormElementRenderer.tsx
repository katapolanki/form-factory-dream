
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InfoIcon, ChevronDown } from "lucide-react";

interface FormElementRendererProps {
  element: FormElement;
  onDrag?: (deltaX: number, deltaY: number) => void;
}

const FormElementRenderer = ({ element, onDrag }: FormElementRendererProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const [date, setDate] = useState<Date>();
  
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
  const getCommonStyle = () => {
    let commonStyle: any = {
      width: element.style?.width || "100%",
      backgroundColor: element.style?.backgroundColor || "transparent",
      color: element.style?.textColor || "",
      borderRadius: element.style?.borderRadius || "0.375rem",
      padding: element.style?.padding || "0.5rem",
      fontSize: element.style?.fontSize || "1rem",
      fontWeight: element.style?.fontWeight || "normal",
    };
    
    // Add position styles if they exist
    if (element.position?.type) {
      commonStyle.position = element.position.type;
      if (element.position.top) commonStyle.top = element.position.top;
      if (element.position.right) commonStyle.right = element.position.right;
      if (element.position.bottom) commonStyle.bottom = element.position.bottom;
      if (element.position.left) commonStyle.left = element.position.left;
      if (element.position.zIndex) commonStyle.zIndex = element.position.zIndex;
    }
    
    // Add text alignment if it exists
    if (element.textAlign) {
      commonStyle.textAlign = element.textAlign;
    }
    
    // Add custom width if specified
    if (element.width === "custom" && element.customWidth) {
      commonStyle.width = `${element.customWidth}${element.customWidthUnit || 'px'}`;
    } else if (element.width === "medium") {
      commonStyle.width = "50%";
    } else if (element.width === "small") {
      commonStyle.width = "25%";
    } else if (element.width === "tiny") {
      commonStyle.width = "10%";
    }
    
    return commonStyle;
  };
  
  const renderElement = () => {
    const commonStyle = getCommonStyle();
    
    switch (element.type) {
      case "title":
        return (
          <h1 style={{ ...commonStyle, fontSize: '2rem', fontWeight: 'bold' }}>
            {element.content || "Title"}
          </h1>
        );
        
      case "subtitle":
        return (
          <h2 style={{ ...commonStyle, fontSize: '1.5rem', fontWeight: 'medium' }}>
            {element.content || "Subtitle"}
          </h2>
        );
      
      case "heading":
        return (
          <h2 style={commonStyle}>{element.content || "Heading"}</h2>
        );
        
      case "paragraph":
        return (
          <p style={commonStyle}>{element.content || "This is a paragraph of text."}</p>
        );
        
      case "text":
      case "input":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Label"}</Label>
            )}
            <Input 
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
              defaultValue={element.defaultValue as string}
            />
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "number":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Number"}</Label>
            )}
            <Input 
              type="number"
              placeholder={element.placeholder || "Enter a number"} 
              style={commonStyle}
              required={element.required}
              min={element.min}
              max={element.max}
              step={element.step}
              defaultValue={element.defaultValue as number}
            />
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Text Area"}</Label>
            )}
            <Textarea 
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
              rows={element.rows || 3}
              defaultValue={element.defaultValue as string}
            />
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Date"}</Label>
            )}
            <div className="border rounded-md p-3">
              <Calendar 
                mode="single" 
                selected={date} 
                onSelect={setDate} 
                className="mx-auto"
              />
            </div>
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`checkbox-${element.id}`} 
              required={element.required}
              defaultChecked={element.defaultChecked}
            />
            <Label 
              htmlFor={`checkbox-${element.id}`} 
              style={commonStyle}
            >
              {element.content || "Checkbox Label"}
            </Label>
            {element.helpText && (
              <p className="text-xs text-muted-foreground ml-2">{element.helpText}</p>
            )}
          </div>
        );
        
      case "radio":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Radio Group"}</Label>
            )}
            <RadioGroup>
              {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${element.id}-${index}`} />
                  <Label htmlFor={`radio-${element.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>{element.content || "Select"}</Label>
            )}
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
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "button":
        const buttonStyle = { ...commonStyle };
        delete buttonStyle.backgroundColor; // Remove to use the button's built-in styling
        delete buttonStyle.color;
        
        return (
          <Button 
            style={buttonStyle}
            variant={element.buttonVariant as any || "default"}
          >
            {element.content || "Button"}
          </Button>
        );
        
      case "divider":
      case "separator":
        return (
          <div className="w-full my-2 border-t" style={commonStyle}></div>
        );
        
      case "spacer":
        return (
          <div style={{ ...commonStyle, height: element.style?.padding || "1rem" }}></div>
        );
        
      case "accordion":
        return (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{element.content || "Accordion Title"}</AccordionTrigger>
              <AccordionContent>
                {element.helpText || "Accordion content goes here. You can customize this in the properties panel."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
        
      case "alert":
        return (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>{element.content || "Alert Title"}</AlertTitle>
            <AlertDescription>
              {element.helpText || "Alert description goes here. You can customize this in the properties panel."}
            </AlertDescription>
          </Alert>
        );
        
      case "avatar":
        return (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {element.content && <span>{element.content}</span>}
          </div>
        );
        
      case "badge":
        return (
          <Badge variant="outline">{element.content || "Badge"}</Badge>
        );
        
      case "aspect-ratio":
        return (
          <div className="w-full">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <div className="flex items-center justify-center h-full">
                {element.content || "16:9 Aspect Ratio"}
              </div>
            </AspectRatio>
          </div>
        );
        
      case "dropdown-menu":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {element.content || "Dropdown Menu"} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {(element.options || ["Item 1", "Item 2", "Item 3"]).map((option, index) => (
                <DropdownMenuItem key={index}>{option}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
