import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  // Log error silently and auto-recover
  console.error('App Error:', error);
  
  // Auto-retry after 1 second
  React.useEffect(() => {
    const timer = setTimeout(() => {
      resetErrorBoundary();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [resetErrorBoundary]);
  
  // Show minimal loading state instead of error page
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export default function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error);
        console.error('Error Info:', errorInfo);
      }}
      onReset={() => {
        // Optionally clear any app state here
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}