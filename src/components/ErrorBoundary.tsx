import React from 'react';
import { RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message =
      error instanceof Error ? error.message : 'Error inesperado en tiempo de ejecución';
    return {
      hasError: true,
      errorMessage: message,
    };
  }

  componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
    console.error('[CFOP Master ErrorBoundary]', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#09090B] p-6 text-zinc-100">
          <div className="w-full max-w-md rounded-lg border border-[#222226] bg-[#111113] p-5">
            <div className="flex items-center justify-between border-b border-[#222226] pb-3">
              <h1 className="text-sm font-semibold text-[#FAFAFA]">
                Excepción de ejecución
              </h1>
              <span className="font-mono text-xs text-[#EF4444]">ERR_RUNTIME</span>
            </div>

            <pre className="mt-3 overflow-x-auto rounded-md border border-[#222226] bg-[#09090B] p-3 font-mono text-xs text-[#EF4444]">
              {this.state.errorMessage}
            </pre>

            <button
              type="button"
              onClick={this.handleReset}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#FAFAFA] px-4 py-2 text-xs font-semibold text-[#09090B] transition-colors hover:bg-zinc-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reiniciar interfaz</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
