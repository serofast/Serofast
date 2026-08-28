import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

// Environment-driven Firebase initialization
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

let authInstance = null;
let googleProviderInstance = null;

// Initialize Firebase SDK only if an environment API key is supplied
if (apiKey && apiKey.trim() !== "") {
  try {
    const firebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "").trim(),
      projectId: (import.meta.env.VITE_FIREBASE_PROJECT_ID || "").trim(),
      storageBucket: (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "").trim(),
      messagingSenderId: (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "").trim(),
      appId: (import.meta.env.VITE_FIREBASE_APP_ID || "").trim(),
    };
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
  } catch (e) {
    console.error("Firebase init error:", e);
  }
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;

// ============================================================================
// SECURITY PROTECTION LAYERS: BRUTE-FORCE & PASSWORD STRENGTH
// ============================================================================

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 Minutes lockout

/**
 * Checks if account email is locked out due to brute force attempts.
 */
export function checkBruteForceLockout(email) {
  if (!email) return { isLocked: false };
  try {
    const key = `serofast_lockout_${email.trim().toLowerCase()}`;
    const recordStr = localStorage.getItem(key);
    if (!recordStr) return { isLocked: false };

    const record = JSON.parse(recordStr);
    const now = Date.now();

    if (record.lockUntil && now < record.lockUntil) {
      const remainingSec = Math.ceil((record.lockUntil - now) / 1000);
      const remainingMin = Math.ceil(remainingSec / 60);
      return {
        isLocked: true,
        message: `Too many failed login attempts! Account locked for safety. Please try again in ${remainingMin} minute${remainingMin > 1 ? "s" : ""}.`,
        remainingSec,
      };
    }

    if (record.lockUntil && now >= record.lockUntil) {
      localStorage.removeItem(key);
    }
  } catch {
    // Graceful fallback
  }
  return { isLocked: false };
}

/**
 * Records failed login attempt for brute force protection.
 */
export function recordFailedAttempt(email) {
  if (!email) return;
  try {
    const key = `serofast_lockout_${email.trim().toLowerCase()}`;
    const recordStr = localStorage.getItem(key);
    let attempts = 0;
    if (recordStr) {
      const parsed = JSON.parse(recordStr);
      attempts = parsed.attempts || 0;
    }

    attempts += 1;
    let lockUntil = null;
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      lockUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    localStorage.setItem(key, JSON.stringify({ attempts, lockUntil, lastAttempt: Date.now() }));
  } catch {
    // Graceful fallback
  }
}

/**
 * Resets failed login attempts on clean login success.
 */
export function clearFailedAttempts(email) {
  if (!email) return;
  try {
    const key = `serofast_lockout_${email.trim().toLowerCase()}`;
    localStorage.removeItem(key);
  } catch {
    // Graceful fallback
  }
}

/**
 * Password Strength Validation Layer.
 */
export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter (A-Z).";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter (a-z).";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number (0-9).";
  }
  return null;
}

// ============================================================================
// GOOGLE AUTH TRACKING FOR SEAMLESS ACCOUNT DETECTION
// ============================================================================

const GOOGLE_EMAILS_KEY = "serofast_google_auth_emails";

export function rememberGoogleAuthEmail(email) {
  if (!email) return;
  try {
    const norm = email.trim().toLowerCase();
    const list = JSON.parse(localStorage.getItem(GOOGLE_EMAILS_KEY) || "[]");
    if (!list.includes(norm)) {
      list.push(norm);
      localStorage.setItem(GOOGLE_EMAILS_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function isKnownGoogleAuthEmail(email) {
  if (!email) return false;
  try {
    const norm = email.trim().toLowerCase();
    const list = JSON.parse(localStorage.getItem(GOOGLE_EMAILS_KEY) || "[]");
    return list.includes(norm);
  } catch {
    return false;
  }
}

// ============================================================================
// FIREBASE AUTH WRAPPER FUNCTIONS (STRICT REAL FIREBASE AUTH)
import { humanizeError } from "../utils/humanizer";

export async function firebaseSignIn(email, password) {
  const normEmail = (email || "").trim().toLowerCase();

  // 1. Check brute force lockout
  const lockout = checkBruteForceLockout(normEmail);
  if (lockout.isLocked) {
    throw new Error(lockout.message);
  }

  if (!authInstance) {
    throw new Error("Authentication service is temporarily unavailable. Please try again in a moment.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, normEmail, password);
    clearFailedAttempts(normEmail);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  } catch (error) {
    recordFailedAttempt(normEmail);

    // 2. Check if this email was previously signed in with Google
    if (isKnownGoogleAuthEmail(normEmail)) {
      throw new Error("This account was created using Google Sign-In and does not have a separate password. Please click 'Continue with Google' to sign in.");
    }

    try {
      if (typeof fetchSignInMethodsForEmail === "function") {
        const methods = await fetchSignInMethodsForEmail(authInstance, normEmail);
        if (methods.includes("google.com") && !methods.includes("password")) {
          rememberGoogleAuthEmail(normEmail);
          throw new Error("This account was created using Google Sign-In and does not have a separate password. Please click 'Continue with Google' to sign in.");
        }
      }
    } catch (e) {
      if (e.message?.includes("Google Sign-In") || e.message?.includes("Continue with Google")) throw e;
    }

    throw new Error(humanizeError(error, "Incorrect email or password. Please double-check your credentials and try again."));
  }
}

export async function firebaseSignUp(email, password) {
  const pwdErr = validatePasswordStrength(password);
  if (pwdErr) {
    throw new Error(pwdErr);
  }

  if (!authInstance) {
    throw new Error("Authentication service is temporarily unavailable. Please try again in a moment.");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const token = await userCredential.user.getIdToken();
    return { user: userCredential.user, token };
  } catch (error) {
    throw new Error(humanizeError(error, "We couldn't create your account right now. Please try again."));
  }
}

export async function firebaseGoogleSignIn() {
  if (!authInstance || !googleProviderInstance) {
    throw new Error("Authentication service is temporarily unavailable. Please try again in a moment.");
  }

  try {
    const result = await signInWithPopup(authInstance, googleProviderInstance);
    if (result.user?.email) {
      rememberGoogleAuthEmail(result.user.email);
    }
    const token = await result.user.getIdToken();
    return { user: result.user, token };
  } catch (error) {
    throw new Error(humanizeError(error, "Google sign-in was closed or cancelled. Please try again."));
  }
}

export async function firebaseSignOutUser() {
  if (authInstance) {
    await signOut(authInstance);
  }
}

export { onAuthStateChanged };
