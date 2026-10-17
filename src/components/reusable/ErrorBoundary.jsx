import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Production-ready React Error Boundary
 * Catches render-phase and runtime exceptions, prevents white screen of death,
 * and presents a graceful, branded recovery screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to error monitoring (e.g. Sentry / Datadog)
    if (process.env.NODE_ENV !== "production") {
      console.error("[SeroFast ErrorBoundary] Uncaught runtime exception:", error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#191616] flex items-center justify-center p-6 selection:bg-brandRed selection:text-white">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-brandRed border border-red-100 shadow-xs mb-5">
              <AlertTriangle size={32} />
            </div>

            <span className="inline-block rounded-full bg-brandRed/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brandRed mb-3">
              Application Notice
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#191616] tracking-tight">
              Something went unexpectedly wrong
            </h1>

            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              We encountered a temporary rendering issue. Your session data remains safe.
            </p>

            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="mt-4 text-left rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-rose-300 overflow-x-auto max-h-36">
                {this.state.error.toString()}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-5 py-3 text-xs font-black text-white shadow-md shadow-brandRed/20 transition-all hover:bg-brandRedDark hover:-translate-y-0.5 active:scale-95 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 cursor-pointer"
              >
                <Home size={14} />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
