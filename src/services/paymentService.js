/**
 * SeroFast Secure Payment Gateway Service (Razorpay Integration)
 * Handles client-side checkout initiation, dynamic SDK injection,
 * and verified receipt metadata handling for the ₹49 Onboarding Fee.
 */

const RAZORPAY_SDK_URL = "https://checkout.razorpay.com/v1/checkout.js";
export const ONBOARDING_FEE_INR = 49;
export const ONBOARDING_FEE_PAISE = ONBOARDING_FEE_INR * 100; // 4900 paise = ₹49.00

/**
 * Dynamically loads the official Razorpay Checkout SDK if not already loaded.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates the ₹49 Store Activation payment via Razorpay.
 *
 * @param {Object} params
 * @param {string} params.shopName - Name of the store being registered
 * @param {string} params.ownerName - Name of the shop owner
 * @param {string} params.email - Contact email
 * @param {string} params.phone - Contact phone number
 * @param {Function} params.onSuccess - Callback on payment success with paymentId
 * @param {Function} params.onFailure - Callback on payment failure or dismissal
 */
export async function initiateOnboardingPayment({
  shopName = "Campus Store",
  ownerName = "Shop Owner",
  email = "",
  phone = "",
  onSuccess = () => {},
  onFailure = () => {},
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure({
      message: "Unable to load Razorpay payment gateway. Please check your internet connection.",
    });
    return;
  }

  // Public Key ID only (Secret key must NEVER be on frontend)
  const keyId =
    import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_serofast_onboarding";

  const isMockKey = keyId === "rzp_test_serofast_onboarding";

  const options = {
    key: keyId,
    amount: ONBOARDING_FEE_PAISE,
    currency: "INR",
    name: "SeroFast Technologies",
    description: `Lifetime Seller Activation Fee for ${shopName}`,
    image: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&q=80",
    prefill: {
      name: ownerName,
      email: email || "seller@serofast.com",
      contact: phone || "9876543210",
    },
    notes: {
      purpose: "Shop Owner Onboarding Fee",
      store_name: shopName,
      amount_inr: "49",
      official_support: "serofastinfo@gmail.com",
    },
    theme: {
      color: "#D32F2F", // SeroFast Brand Red
    },
    modal: {
      ondismiss: function () {
        onFailure({
          cancelled: true,
          message: "Payment was cancelled. Shop activation requires ₹49 payment to proceed.",
        });
      },
    },
    handler: function (response) {
      if (response?.razorpay_payment_id) {
        onSuccess({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || `ORD-${Date.now()}`,
          signature: response.razorpay_signature || "",
          amount: ONBOARDING_FEE_INR,
          currency: "INR",
          paidAt: new Date().toISOString(),
        });
      } else {
        onFailure({ message: "Invalid payment response received from gateway." });
      }
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      onFailure({
        message: response.error?.description || "Payment failed. Please try again.",
        code: response.error?.code,
      });
    });
    rzp.open();
  } catch (err) {
    if (isMockKey) {
      // In sandbox/test environment fallback when testing locally without live keys
      const mockPaymentId = `pay_mock_${Date.now().toString(36).toUpperCase()}`;
      onSuccess({
        paymentId: mockPaymentId,
        orderId: `ORD-${Date.now()}`,
        signature: "mock_signature_verified",
        amount: ONBOARDING_FEE_INR,
        currency: "INR",
        paidAt: new Date().toISOString(),
        isDemo: true,
      });
    } else {
      onFailure({ message: "Error opening payment window." });
    }
  }
}
