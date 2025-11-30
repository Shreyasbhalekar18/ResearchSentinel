'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
                    <Card className="max-w-lg w-full shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <svg
                                    className="w-8 h-8 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <CardTitle className="text-2xl font-bold text-slate-900">
                                Oops! Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-slate-600">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                            {this.state.error && (
                                <details className="text-left bg-slate-50 p-4 rounded-lg">
                                    <summary className="cursor-pointer text-sm font-medium text-slate-700 mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="text-xs text-red-600 overflow-auto">
                                        {this.state.error.message}
                                    </pre>
                                </details>
                            )}
                            <div className="flex gap-3 justify-center pt-4">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Reload Page
                                </Button>
                                <Button
                                    onClick={() => (window.location.href = '/')}
                                    variant="outline"
                                >
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
