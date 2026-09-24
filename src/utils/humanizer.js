/**
 * SeroFast Humanoid Message & Error Translator
 * Translates raw backend errors, database constraints (SQL, Postgres, Indexes),
 * Firebase Auth codes, network exceptions, and system codes into warm, friendly,
 * conversational, and actionable humanoid messages.
 */

/**
 * Humanizes any error object, string, or code into a polite, clear message.
 * @param {Error|string|object} error - The caught error or error message.
 * @param {string} [fallback="Something didn't go as planned. Please try again in a moment."] - Default friendly fallback.
 * @returns {string} Humanoid friendly error message.
 */
export function humanizeError(error, fallback = "Something didn't go as planned. Please try again in a moment.") {
  if (!error) return fallback;

  let raw = "";
  if (typeof error === "string") {
    raw = error;
  } else if (error?.message) {
    raw = error.message;
  } else if (error?.error_description) {
    raw = error.error_description;
  } else if (error?.details) {
    raw = typeof error.details === "string" ? error.details : JSON.stringify(error.details);
  } else {
    try {
      raw = JSON.stringify(error);
    } catch {
      raw = String(error);
    }
  }

  const str = raw.toLowerCase();

  // 1. Firebase Auth Codes & Errors
  if (str.includes("auth/invalid-credential") || str.includes("auth/wrong-password") || str.includes("auth/user-not-found")) {
    return "Incorrect email or password. Please double-check and try again.";
  }
  if (str.includes("auth/email-already-in-use")) {
    return "An account with this email address already exists. Please log in instead.";
  }
  if (str.includes("auth/too-many-requests")) {
    return "Too many attempts made recently. For your account security, please wait a minute and try again.";
  }
  if (str.includes("auth/invalid-email")) {
    return "Please enter a valid email address (e.g., name@campus.edu).";
  }
  if (str.includes("auth/weak-password")) {
    return "Your password should be at least 6 characters long for good security.";
  }
  if (str.includes("auth/popup-closed-by-user") || str.includes("popup_closed_by_user")) {
    return "Google sign-in was closed before completing. You can try again whenever you're ready.";
  }
  if (str.includes("auth/network-request-failed")) {
    return "We're having trouble connecting to the network. Please check your internet connection and try again.";
  }
  if (str.includes("auth/operation-not-allowed") || str.includes("operation_not_allowed")) {
    return "Email/Password sign-up is not enabled in your Firebase Console. Please enable Email/Password under Authentication > Sign-in method.";
  }
  if (str.includes("auth/user-disabled")) {
    return "This account is currently inactive. Please contact SeroFast support for assistance.";
  }

  // 2. Database Constraints, Indexes & SQL codes
  if (str.includes("index") || str.includes("idx_") || str.includes("unique constraint") || str.includes("23505") || str.includes("already exists")) {
    if (str.includes("email")) return "This email is already registered with another account.";
    if (str.includes("phone")) return "This phone number is already linked to another account.";
    if (str.includes("shop")) return "A store with this name or URL already exists. Please try another name.";
    return "A record with these details already exists. Please verify your information.";
  }
  if (str.includes("foreign key") || str.includes("23503")) {
    return "The associated shop or user record could not be found. Please refresh and try again.";
  }
  if (str.includes("not-null") || str.includes("23502") || str.includes("null value in column")) {
    return "Please fill out all required fields before proceeding.";
  }
  if (str.includes("pgrst116") || str.includes("0 rows") || str.includes("no rows")) {
    return "We couldn't find the requested details. It may have been updated or removed.";
  }
  if (str.includes("permission denied") || str.includes("row-level security") || str.includes("42501")) {
    return "You don't have permission to perform this update. Please make sure you're logged into the right account.";
  }
  if (str.includes("column does not exist") || str.includes("42703")) {
    return "Our system is updating. Please refresh the page and try again.";
  }

  // 3. Network & Gateway Status Codes
  if (str.includes("failed to fetch") || str.includes("network error") || str.includes("err_connection")) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }
  if (str.includes("timeout") || str.includes("timed out")) {
    return "The request took longer than expected. Please try again.";
  }
  if (str.includes("400") || str.includes("bad request")) {
    return "We couldn't process this request with the details provided. Please review your input.";
  }
  if (str.includes("401") || str.includes("unauthorized")) {
    return "Your session has expired. Please log in again to continue.";
  }
  if (str.includes("403") || str.includes("forbidden")) {
    return "Access is restricted. Please make sure you have the proper permissions.";
  }
  if (str.includes("404") || str.includes("not found")) {
    return "We couldn't find what you were looking for.";
  }
  if (str.includes("500") || str.includes("internal server error") || str.includes("server error")) {
    return "Our server encountered a temporary hiccup. Please give us a moment and try again.";
  }

  // 4. Payment Gateway & Razorpay
  if (str.includes("payment cancelled") || str.includes("user cancelled") || str.includes("payment_cancelled")) {
    return "Payment was cancelled. You can complete it whenever you're ready.";
  }
  if (str.includes("insufficient balance") || str.includes("payment failed")) {
    return "Payment could not be completed by your bank. Please try another UPI ID or card.";
  }
  if (str.includes("min ₹100") || str.includes("minimum withdrawal")) {
    return "A minimum of ₹100 is required to initiate a withdrawal.";
  }
  if (str.includes("exceeds available") || str.includes("insufficient funds")) {
    return "Withdrawal amount exceeds your available balance.";
  }

  // 5. JavaScript runtime exceptions
  if (str.includes("typeerror") || str.includes("cannot read properties") || str.includes("referenceerror") || str.includes("syntaxerror")) {
    return "Something unexpected happened on our side. Please refresh the page to continue smoothly.";
  }

  // Clean raw technical prefixes if present
  let cleanMessage = raw
    .replace(/^error:\s*/i, "")
    .replace(/^uncaught\s*/i, "")
    .replace(/firebase:\s*/i, "")
    .replace(/\(auth\/[a-z0-9-]+\)\.?/gi, "")
    .replace(/\[[a-z0-9_-]+\]/gi, "")
    .trim();

  // If the message is still overly technical or cryptic, return friendly fallback
  if (!cleanMessage || cleanMessage.length > 200 || cleanMessage.includes("{") || cleanMessage.includes("function") || cleanMessage.includes("pgrst")) {
    return fallback;
  }

  // Capitalize first letter and ensure ending punctuation
  cleanMessage = cleanMessage.charAt(0).toUpperCase() + cleanMessage.slice(1);
  if (!/[.!?]$/.test(cleanMessage)) {
    cleanMessage += ".";
  }

  return cleanMessage;
}

/**
 * Humanizes job completion & success messages.
 * @param {string} action - The completed job (e.g. "product_saved", "profile_updated", "withdrawal_initiated").
 * @param {object} [context={}] - Contextual parameters like name, count, amount.
 * @returns {string} Humanoid warm confirmation message.
 */
export function humanizeSuccess(action, context = {}) {
  switch (action) {
    case "login_success":
      return `Welcome back, ${context.name || "friend"}! You're successfully logged in.`;
    case "signup_success":
      return "Welcome to SeroFast! Your account is ready.";
    case "shop_created":
      return "Your campus store is officially live! Welcome aboard.";
    case "draft_saved":
      return "Your progress has been automatically saved.";
    case "product_added":
      return context.count && context.count > 1
        ? `Added ${context.count} items to your store inventory.`
        : `Added ${context.name || "the item"} to your store inventory.`;
    case "product_updated":
      return "Product details were updated successfully.";
    case "product_deleted":
      return "Product removed from your store inventory.";
    case "withdrawal_requested":
      return `Your withdrawal request for ₹${context.amount || "0"} was submitted successfully.`;
    case "withdrawal_completed":
      return `₹${context.amount || "0"} has been transferred to your account.`;
    case "order_status_updated":
      return `Order status updated to ${context.status || "new status"}.`;
    case "profile_updated":
      return "Your profile details have been saved.";
    case "settings_saved":
      return "Your store settings have been saved.";
    case "invoice_sent":
      return `Official invoice has been emailed to ${context.email || "your email"}.`;
    default:
      return "Changes saved successfully.";
  }
}

export default { humanizeError, humanizeSuccess };
