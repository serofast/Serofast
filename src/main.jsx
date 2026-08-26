import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ============================================================================
// CONSOLE SECURITY SANITIZER & LEAK PREVENTION
// ============================================================================
(function sanitizeConsoleOutput() {
  const SENSITIVE_PATTERNS = [
    /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g, // JWT Tokens
    /AIzaSy[A-Za-z0-9_-]{33}/g,                                        // Firebase API keys
    /sbp_[a-zA-Z0-9]{20,}/g,                                          // Supabase service keys
    /VITE_[A-Z0-9_]+/g,                                                // Environment variable names
  ];

  function maskSensitive(value) {
    if (typeof value === "string") {
      let sanitized = value;
      SENSITIVE_PATTERNS.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, "[PROTECTED_CREDENTIAL]");
      });
      return sanitized;
    }
    if (typeof value === "object" && value !== null) {
      try {
        const str = JSON.stringify(value);
        if (str.includes("apiKey") || str.includes("anonKey") || str.includes("token") || str.includes("secret")) {
          return "[PROTECTED_OBJECT]";
        }
      } catch {
        // Ignored
      }
    }
    return value;
  }

  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalInfo = console.info;

  console.log = (...args) => originalLog.apply(console, args.map(maskSensitive));
  console.warn = (...args) => originalWarn.apply(console, args.map(maskSensitive));
  console.error = (...args) => originalError.apply(console, args.map(maskSensitive));
  console.info = (...args) => originalInfo.apply(console, args.map(maskSensitive));
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);