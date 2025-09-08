import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const retry = () => {
        this.setState({ hasError: false, error: undefined });
      };

      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={retry} />;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The application encountered an unexpected error. This could be due to:
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                <li>Network connectivity issues</li>
                <li>Database connection problems</li>
                <li>Component rendering errors</li>
              </ul>
              {this.state.error && (
                <details className="mt-4">
                  <summary className="text-sm font-medium cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button onClick={retry} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;