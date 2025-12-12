import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// OWASP A09: Security Logging and Monitoring Failures
// Global Error Boundary to catch crashes and prevent information leakage (stack traces) to users.
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real application, log this to a secure logging service (e.g., Sentry, Datadog)
    console.error("Security Audit Log: Uncaught exception in UI", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
                <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Application Error</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Something went wrong. For security reasons, the system has halted to prevent data corruption.
                </p>
                {this.state.error && (
                    <div className="bg-red-50 border border-red-100 rounded p-3 mb-6 text-xs text-red-800 text-left overflow-auto max-h-32 font-mono">
                        {this.state.error.toString()}
                    </div>
                )}
                <button 
                    onClick={() => window.location.reload()} 
                    className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                    Reload Application
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}