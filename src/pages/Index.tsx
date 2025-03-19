
import { useState } from "react";
import { Toaster } from "sonner";
import { DndContext } from "@dnd-kit/core";
import FormBuilder from "@/components/FormBuilder";
import Header from "@/components/Header";
import WelcomeModal from "@/components/WelcomeModal";

const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Toaster position="top-right" />
      
      {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <DndContext>
          <FormBuilder />
        </DndContext>
      </main>
      
      <footer className="border-t py-6 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Form Builder App © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
