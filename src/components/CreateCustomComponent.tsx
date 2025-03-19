
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

interface CreateCustomComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (component: any) => void;
}

const CreateCustomComponent = ({ open, onOpenChange, onSave }: CreateCustomComponentProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("basic");
  const [icon, setIcon] = useState("Box");
  const [markup, setMarkup] = useState("");
  
  const handleSave = () => {
    if (!name) {
      toast.error("Please enter a component name");
      return;
    }
    
    if (!markup) {
      toast.error("Please enter component markup");
      return;
    }
    
    onSave({
      name,
      description,
      category,
      icon,
      markup,
      isCustom: true
    });
    
    // Reset form
    setName("");
    setDescription("");
    setCategory("basic");
    setIcon("Box");
    setMarkup("");
    
    onOpenChange(false);
    toast.success("Custom component created successfully");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Custom Component</DialogTitle>
          <DialogDescription>
            Design your own custom component that can be reused across your forms.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="My Custom Component"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="A brief description of your component"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="layout">Layout</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Select
              value={icon}
              onValueChange={setIcon}
            >
              <SelectTrigger id="icon" className="col-span-3">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Box">Box</SelectItem>
                <SelectItem value="Type">Type</SelectItem>
                <SelectItem value="Layout">Layout</SelectItem>
                <SelectItem value="Layers">Layers</SelectItem>
                <SelectItem value="Code">Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="markup" className="text-right pt-2">
              HTML/JSX
            </Label>
            <Textarea
              id="markup"
              placeholder="<div className='my-custom-component'>Content goes here</div>"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              className="col-span-3 font-mono text-sm h-[200px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Component</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCustomComponent;
