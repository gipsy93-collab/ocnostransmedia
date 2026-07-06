import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in narrative block:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ocean-dark flex flex-col items-center justify-center p-6 text-white text-center z-[10000] relative">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-coral/20 text-coral rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold">Algo salió mal</h2>
            <p className="text-white/70">
              Ha ocurrido un error inesperado al cargar esta sección interactiva.
            </p>
            {this.state.error && (
              <pre className="text-xs bg-black/30 p-4 rounded-xl text-left overflow-x-auto text-white/50">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-6">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  if (this.props.onReset) this.props.onReset();
                  else window.location.href = '/interactivos';
                }}
                className="btn-3d px-8 py-3 bg-coral text-white hover:bg-coral/80 transition-colors inline-flex items-center gap-2 mx-auto"
              >
                <Home size={18} /> VOLVER A INTERACTIVOS
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
