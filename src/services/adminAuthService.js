// ============================================================================
// SEROFAST ADMIN PORTAL - AUTHENTICATION & SESSION GATEWAY SERVICE
// ============================================================================

const SESSION_KEY = "serofast_admin_session";
const ATTEMPTS_KEY = "serofast_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutes lockout
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours session life

// Fallback configuration if .env keys are not yet configured
const DEFAULT_CONFIG = {
  user: "admin@serofast.com",
  passcode: "Serofast@Admin2026!",
  securityCode: "202688",
};

/**
 * Retrieves configured admin credentials from environment variables securely
 */
function getExpectedCredentials() {
  const env = import.meta.env || {};
  return {
    user: (env.VITE_ADMIN_USER || DEFAULT_CONFIG.user).trim().toLowerCase(),
    passcode: (env.VITE_ADMIN_PASSCODE || DEFAULT_CONFIG.passcode).trim(),
    securityCode: (env.VITE_ADMIN_SECURITY_CODE || DEFAULT_CONFIG.securityCode).trim(),
  };
}

/**
 * Checks brute-force lockout status
 */
export function getLockoutStatus() {
  try {
    const data = JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY) || "{}");
    if (!data.count) return { isLocked: false, remainingSeconds: 0 };

    if (data.count >= MAX_ATTEMPTS) {
      const elapsed = Date.now() - (data.lastAttempt || 0);
      if (elapsed < LOCKOUT_DURATION_MS) {
        const remainingSeconds = Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 1000);
        return { isLocked: true, remainingSeconds };
      } else {
        // Lockout expired, reset attempts
        sessionStorage.removeItem(ATTEMPTS_KEY);
        return { isLocked: false, remainingSeconds: 0 };
      }
    }

    return { isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS - data.count };
  } catch {
    return { isLocked: false, remainingSeconds: 0 };
  }
}

/**
 * Increments failed attempt count
 */
function recordFailedAttempt() {
  try {
    const data = JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY) || "{}");
    const newCount = (data.count || 0) + 1;
    sessionStorage.setItem(
      ATTEMPTS_KEY,
      JSON.stringify({
        count: newCount,
        lastAttempt: Date.now(),
      })
    );
    return newCount;
  } catch {
    return 1;
  }
}

/**
 * Resets failed attempts after successful authentication
 */
function resetAttempts() {
  try {
    sessionStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    // Ignored
  }
}

/**
 * Validates whether the active browser tab holds a valid, non-expired Admin session
 */
export function isAdminAuthenticated() {
  try {
    const sessionRaw = sessionStorage.getItem(SESSION_KEY);
    if (!sessionRaw) return false;

    const session = JSON.parse(sessionRaw);
    if (!session || !session.token || !session.expiresAt) return false;

    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }

    return true;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return false;
  }
}

/**
 * Retrieves the currently active admin session metadata
 */
export function getAdminSession() {
  if (!isAdminAuthenticated()) return null;
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

/**
 * Checks if a given username/email matches the configured administrator account
 */
export function isAdminUser(identifier) {
  if (!identifier) return false;
  const expected = getExpectedCredentials();
  const input = String(identifier).trim().toLowerCase();
  return input === expected.user || input === "admin" || input === "admin@serofast.com";
}

/**
 * Authenticates admin credentials with rate-limiting and session generation
 * @param {Object} credentials - { username, passcode, securityCode }
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function loginAdmin({ username = "", passcode = "", securityCode = "" }) {
  // Check lockout
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `Too many failed attempts. Security cooldown active for ${lockout.remainingSeconds}s.`,
      isLocked: true,
      remainingSeconds: lockout.remainingSeconds,
    };
  }

  const expected = getExpectedCredentials();
  const inputUser = String(username).trim().toLowerCase();
  const inputPass = String(passcode).trim();
  const inputPin = String(securityCode || "").trim();

  // Format validation
  if (!inputUser || !inputPass) {
    return {
      success: false,
      error: "Username/Email and Password are required.",
    };
  }

  // Timing defense
  await new Promise((r) => setTimeout(r, 400));

  const isUserValid = inputUser === expected.user || inputUser === "admin";
  const isPassValid = inputPass === expected.passcode;
  // Verify PIN if provided or required
  const isPinValid = !inputPin || inputPin === expected.securityCode;

  if (isUserValid && isPassValid && isPinValid) {
    resetAttempts();

    const sessionPayload = {
      user: inputUser,
      role: "Super Admin",
      authenticatedAt: new Date().toISOString(),
      expiresAt: Date.now() + SESSION_TTL_MS,
      token: `adm_sec_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    };

    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionPayload));
    } catch (e) {
      console.warn("Storage write notice:", e?.message);
    }

    return { success: true, session: sessionPayload };
  } else {
    const attempts = recordFailedAttempt();
    const remaining = MAX_ATTEMPTS - attempts;

    if (remaining <= 0) {
      return {
        success: false,
        error: `Account locked due to 5 consecutive failed attempts. Please wait 2 minutes.`,
        isLocked: true,
        remainingSeconds: 120,
      };
    }

    return {
      success: false,
      error: `Invalid admin credentials. (${remaining} ${remaining === 1 ? "attempt" : "attempts"} remaining)`,
      attemptsLeft: remaining,
    };
  }
}

/**
 * Destroys the admin session immediately
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignored
  }
  return { success: true };
}
