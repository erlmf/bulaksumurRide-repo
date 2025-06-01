import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Customizable fallback UI
      return (
        <div className="p-6 max-w-xl mx-auto my-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTitle className="text-xl font-bold">Something went wrong</AlertTitle>
            <AlertDescription>
              <div className="mt-2 text-sm">
                {this.state.error && <p className="font-mono">{this.state.error.toString()}</p>}
                {this.props.errorMessage && <p className="mt-2">{this.props.errorMessage}</p>}
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-4 justify-center mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="default"
            >
              Reload Page
            </Button>
            <Button
              onClick={() => window.history.back()}
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
