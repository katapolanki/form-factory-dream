import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  ThemeSwitcher,
  AuthProvider,
  LoadingOverlay
} from '@/providers';
import { 
  HomePage,
  EditorPage, 
  PreviewPage,
  AuthPage,
  NotFoundPage
} from '@/pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 perc
      retry: 1,
    },
  },
});

const ErrorFallback = () => (
  <div className="p-4 text-destructive">
    <h1>Something went wrong</h1>
    <button onClick={() => window.location.reload()}>Refresh</button>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter>
              <Suspense fallback={<LoadingOverlay />}>
                <ThemeSwitcher />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth/*" element={<AuthPage />} />
                  <Route path="/forms/:id/edit" element={<EditorPage />} />
                  <Route path="/forms/:id/preview" element={<PreviewPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <Toaster richColors closeButton />
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
