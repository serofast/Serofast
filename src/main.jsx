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
    /rzp_(?:test|live)_[a-zA-Z0-9]{14,}/g,                            // Razorpay Key IDs
    /VITE_[A-Z0-9_]+/g,                                                // Environment variable names
  ];

  // Dynamically register active env secret values to ensure zero leaks
  const dynamicEnvSecrets = Object.entries(import.meta.env || {})
    .filter(([k, v]) => typeof v === 'string' && v.length >= 4 && !['development', 'production', 'test', '/', 'true', 'false'].includes(v.toLowerCase()) && (k.startsWith('VITE_') || k.includes('KEY') || k.includes('PASS') || k.includes('SECRET') || k.includes('URL')))
    .map(([, v]) => v);

  function maskSensitive(value) {
    if (typeof value === "string") {
      let sanitized = value;
      // Redact dynamic env secrets
      for (const secret of dynamicEnvSecrets) {
        if (secret && sanitized.includes(secret)) {
          sanitized = sanitized.split(secret).join("[PROTECTED_CREDENTIAL]");
        }
      }
      // Redact known patterns
      SENSITIVE_PATTERNS.forEach((pattern) => {
        sanitized = sanitized.replace(pattern, "[PROTECTED_CREDENTIAL]");
      });
      return sanitized;
    }
    if (typeof value === "object" && value !== null) {
      try {
        const str = JSON.stringify(value);
        if (
          str.includes("apiKey") ||
          str.includes("anonKey") ||
          str.includes("token") ||
          str.includes("secret") ||
          str.includes("password") ||
          str.includes("passcode") ||
          str.includes("pin")
        ) {
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
  const originalDebug = console.debug;

  console.log = (...args) => originalLog.apply(console, args.map(maskSensitive));
  console.warn = (...args) => originalWarn.apply(console, args.map(maskSensitive));
  console.error = (...args) => originalError.apply(console, args.map(maskSensitive));
  console.info = (...args) => originalInfo.apply(console, args.map(maskSensitive));
  if (originalDebug) {
    console.debug = (...args) => originalDebug.apply(console, args.map(maskSensitive));
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);