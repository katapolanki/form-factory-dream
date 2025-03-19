
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <FileQuestion className="h-24 w-24 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
