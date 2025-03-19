
import { useRef, useState, useEffect } from "react";
import { FormElement } from "./FormBuilder";
import { useFormValidation } from "@/hooks/useFormValidation";
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
import { 
  InfoIcon, 
  ChevronDown, 
  AlertCircle
} from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface FormElementRendererProps {
  element: FormElement;
  onDrag?: (deltaX: number, deltaY: number) => void;
  preview?: boolean;
}

const FormElementRenderer = ({ element, onDrag, preview = false }: FormElementRendererProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    element.defaultValue && typeof element.defaultValue === 'string' 
      ? new Date(element.defaultValue) 
      : undefined
  );
  const [value, setValue] = useState<string | number | undefined>(element.defaultValue);
  const [touched, setTouched] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const { validateElement, getElementValidation } = useFormValidation();
  const validation = touched ? getElementValidation(element.id) : { valid: true };
  
  // Update value when defaultValue changes
  useEffect(() => {
    setValue(element.defaultValue);
  }, [element.defaultValue]);
  
  // Update date when defaultValue is a date string
  useEffect(() => {
    if (element.defaultValue && typeof element.defaultValue === 'string' && element.type === 'date') {
      try {
        setDate(new Date(element.defaultValue));
      } catch (e) {
        console.error("Invalid date string:", element.defaultValue);
      }
    }
  }, [element.defaultValue, element.type]);
  
  const handleBlur = () => {
    if (element.validateOnBlur) {
      setTouched(true);
    }
  };
  
  const handleChange = (newValue: any) => {
    setValue(newValue);
    if (element.validateOnChange) {
      setTouched(true);
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!onDrag || preview) return;
    
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
  
  // Get accessibility attributes
  const getA11yProps = () => {
    const props: any = {};
    
    if (element.ariaLabel) {
      props['aria-label'] = element.ariaLabel;
    }
    
    if (element.ariaDescription) {
      props['aria-description'] = element.ariaDescription;
    }
    
    if (element.role) {
      props.role = element.role;
    }
    
    if (element.tabIndex !== undefined) {
      props.tabIndex = element.tabIndex;
    }
    
    if (!validation.valid) {
      props['aria-invalid'] = true;
      props['aria-errormessage'] = `error-${element.id}`;
    }
    
    return props;
  };
  
  // Render validation error message
  const renderValidationError = () => {
    if (!touched || validation.valid) {
      return null;
    }
    
    return (
      <div 
        className="text-destructive text-sm flex items-center mt-1"
        id={`error-${element.id}`}
      >
        <AlertCircle className="h-4 w-4 mr-1" />
        {validation.error}
      </div>
    );
  };
  
  const renderElement = () => {
    const commonStyle = getCommonStyle();
    const a11yProps = getA11yProps();
    
    switch (element.type) {
      case "title":
        return (
          <h1 
            style={{ ...commonStyle, fontSize: '2rem', fontWeight: 'bold' }}
            {...a11yProps}
          >
            {element.content || "Title"}
          </h1>
        );
        
      case "subtitle":
        return (
          <h2 
            style={{ ...commonStyle, fontSize: '1.5rem', fontWeight: 'medium' }}
            {...a11yProps}
          >
            {element.content || "Subtitle"}
          </h2>
        );
      
      case "heading":
        return (
          <h2 
            style={commonStyle}
            {...a11yProps}
          >
            {element.content || "Heading"}
          </h2>
        );
        
      case "paragraph":
        return (
          <p 
            style={commonStyle}
            {...a11yProps}
          >
            {element.content || "This is a paragraph of text."}
          </p>
        );
        
      case "text":
      case "input":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label htmlFor={`input-${element.id}`}>
                {element.content || "Label"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input 
              id={`input-${element.id}`}
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
              defaultValue={element.defaultValue as string}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              minLength={element.minLength}
              maxLength={element.maxLength}
              pattern={element.pattern}
              className={!validation.valid ? "border-destructive" : ""}
              {...a11yProps}
            />
            {renderValidationError()}
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "number":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label htmlFor={`number-${element.id}`}>
                {element.content || "Number"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Input 
              id={`number-${element.id}`}
              type="number"
              placeholder={element.placeholder || "Enter a number"} 
              style={commonStyle}
              required={element.required}
              min={element.min}
              max={element.max}
              step={element.step}
              defaultValue={element.defaultValue as number}
              value={value as number}
              onChange={(e) => handleChange(parseFloat(e.target.value))}
              onBlur={handleBlur}
              className={!validation.valid ? "border-destructive" : ""}
              {...a11yProps}
            />
            {renderValidationError()}
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "textarea":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label htmlFor={`textarea-${element.id}`}>
                {element.content || "Text Area"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Textarea 
              id={`textarea-${element.id}`}
              placeholder={element.placeholder || "Enter text"} 
              style={commonStyle}
              required={element.required}
              rows={element.rows || 3}
              defaultValue={element.defaultValue as string}
              value={value as string}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              minLength={element.minLength}
              maxLength={element.maxLength}
              className={!validation.valid ? "border-destructive" : ""}
              {...a11yProps}
            />
            {renderValidationError()}
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "date":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label htmlFor={`date-${element.id}`}>
                {element.content || "Date"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={`date-${element.id}`}
                  variant="outline"
                  className={`w-full justify-start text-left ${!validation.valid ? "border-destructive" : ""}`}
                  {...a11yProps}
                >
                  {date ? format(date, "PPP") : <span>{element.placeholder || "Select date"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    handleChange(newDate?.toISOString());
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {renderValidationError()}
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
              onCheckedChange={handleChange}
              onBlur={handleBlur}
              {...a11yProps}
            />
            <Label 
              htmlFor={`checkbox-${element.id}`} 
              style={commonStyle}
            >
              {element.content || "Checkbox Label"}
              {element.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {element.helpText && (
              <p className="text-xs text-muted-foreground ml-2">{element.helpText}</p>
            )}
            {renderValidationError()}
          </div>
        );
        
      case "radio":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label>
                {element.content || "Radio Group"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <RadioGroup
              defaultValue={element.defaultValue as string}
              onValueChange={handleChange}
              {...a11yProps}
            >
              {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`radio-${element.id}-${index}`} 
                  />
                  <Label htmlFor={`radio-${element.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {renderValidationError()}
            {element.helpText && (
              <p className="text-xs text-muted-foreground">{element.helpText}</p>
            )}
          </div>
        );
        
      case "select":
        return (
          <div className="space-y-2 w-full">
            {element.labelPosition !== "hidden" && (
              <Label htmlFor={`select-${element.id}`}>
                {element.content || "Select"}
                {element.required && <span className="text-destructive ml-1">*</span>}
              </Label>
            )}
            <Select
              defaultValue={element.defaultValue as string}
              onValueChange={handleChange}
            >
              <SelectTrigger 
                id={`select-${element.id}`} 
                style={commonStyle}
                className={!validation.valid ? "border-destructive" : ""}
                {...a11yProps}
              >
                <SelectValue placeholder={element.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {(element.options || ["Option 1", "Option 2", "Option 3"]).map((option, index) => (
                  <SelectItem key={index} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {renderValidationError()}
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
            {...a11yProps}
          >
            {element.content || "Button"}
          </Button>
        );
        
      case "divider":
      case "separator":
        return (
          <div 
            className="w-full my-2 border-t" 
            style={commonStyle}
            role="separator"
            {...a11yProps}
          ></div>
        );
        
      case "spacer":
        return (
          <div 
            style={{ ...commonStyle, height: element.style?.padding || "1rem" }}
            role="none"
            {...a11yProps}
          ></div>
        );
        
      case "accordion":
        return (
          <Accordion type="single" collapsible className="w-full" {...a11yProps}>
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
          <Alert {...a11yProps}>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>{element.content || "Alert Title"}</AlertTitle>
            <AlertDescription>
              {element.helpText || "Alert description goes here. You can customize this in the properties panel."}
            </AlertDescription>
          </Alert>
        );
        
      case "avatar":
        return (
          <div className="flex items-center space-x-2" {...a11yProps}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt={element.ariaLabel || "@shadcn"} />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            {element.content && <span>{element.content}</span>}
          </div>
        );
        
      case "badge":
        return (
          <Badge variant="outline" {...a11yProps}>
            {element.content || "Badge"}
          </Badge>
        );
        
      case "aspect-ratio":
        return (
          <div className="w-full" {...a11yProps}>
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
              <Button variant="outline" {...a11yProps}>
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
  
  // Add responsive classes based on visibility settings
  const getResponsiveClasses = () => {
    const classes = [];
    
    if (element.position?.hideMobile) {
      classes.push('hidden sm:block');
    }
    
    if (element.position?.hideTablet) {
      classes.push('hidden md:block sm:hidden');
    }
    
    if (element.position?.hideDesktop) {
      classes.push('hidden lg:hidden md:block');
    }
    
    return classes.join(' ');
  };
  
  return (
    <div 
      className={`${onDrag && !preview ? 'cursor-move' : ''} ${isDragging ? 'opacity-70' : ''} ${getResponsiveClasses()}`}
      onMouseDown={handleMouseDown}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {renderElement()}
    </div>
  );
};

export default FormElementRenderer;
