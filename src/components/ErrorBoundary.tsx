import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full">
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-6 border border-error/20">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold text-on-surface mb-4">앗, 오류가 발생했습니다.</h2>
          <p className="text-base text-on-surface-variant font-medium mb-8 max-w-md break-keep">
            예상치 못한 문제가 발생하여 페이지를 표시할 수 없습니다. 잠시 후 다시 시도해 주세요.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-surface-variant text-on-surface-variant rounded-full font-bold shadow-sm hover:bg-surface-dim transition-colors"
            >
              새로고침
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              홈으로 이동
            </Link>
          </div>
          {this.state.error && process.env.NODE_ENV !== 'production' && (
             <pre className="mt-8 p-4 bg-surface-dim rounded-lg text-left text-xs font-mono text-error/80 overflow-auto max-w-full">
               {this.state.error.toString()}
             </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
