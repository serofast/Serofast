import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import OnboardingHeader from "./OnboardingHeader";
import ProgressSteps from "./ProgressSteps";
import BasicShopDetailsStep from "./BasicShopDetailsStep";
import SellerInfoStep from "./SellerInfoStep";
import BusinessDetailsStep from "./BusinessDetailsStep";
import PaymentSettlementStep from "./PaymentSettlementStep";
import DeliverySettingsStep from "./DeliverySettingsStep";
import LaunchReviewStep from "./LaunchReviewStep";
import { createShopInSupabase } from "../../lib/supabase";

const STEP_PATHS = {
  1: "/create-shop",
  2: "/create-shop/step2",
  3: "/create-shop/step3",
  4: "/create-shop/step4",
  5: "/create-shop/step5",
  6: "/create-shop/step6",
};

const PATH_TO_STEP = {
  "/create-shop": 1,
  "/create-shop/step2": 2,
  "/create-shop/step3": 3,
  "/create-shop/step4": 4,
  "/create-shop/step5": 5,
  "/create-shop/step6": 6,
  "/create-shop/details": 1,
  "/create-shop/products": 3,
  "/create-shop/launch": 6,
};

const initialForm = {
  shopName: "",
  category: "Fashion",
  tagline: "",
  description: "",
  ownerName: "",
  phone: "",
  email: "",
  address: "",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "",
  businessType: "Individual",
  sellerType: "Campus Partner",
  gstNo: "",
  panNo: "",
  pickupAddress: "",
  accountHolder: "",
  accountNumber: "",
  ifscCode: "",
  upiId: "",
  settlementMethod: "Instant UPI",
  shippingMethod: "Campus Delivery + Store Pickup",
  deliveryRadius: "5 km",
  shippingFee: 20,
  freeShippingThreshold: 499,
  prepTime: "15-30 mins",
  returnPolicy: "7 Days Easy Returns",
  cancellationPolicy: "Free cancellation before dispatch",
  logo: null,
  cover: null,
};

export default function CreateShopPage({ onClose, onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();

  const step = PATH_TO_STEP[location.pathname] || 1;

  const [form, setForm] = useState(initialForm);

  const updateForm = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const next = () => {
    navigate(STEP_PATHS[Math.min(6, step + 1)]);
  };

  const back = () => {
    navigate(STEP_PATHS[Math.max(1, step - 1)]);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/shop-owner/dashboard");
  };

  const handleLaunchShop = async () => {
    const newShopData = await createShopInSupabase(form);
    if (onComplete) {
      onComplete(newShopData);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-slate-900 font-sans">
      <OnboardingHeader step={step} onClose={handleClose} />

      <main className="min-h-[calc(100svh-64px)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
          <ProgressSteps step={step} />

          {step === 1 ? (
            <BasicShopDetailsStep form={form} updateForm={updateForm} onNext={next} />
          ) : step === 2 ? (
            <SellerInfoStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 3 ? (
            <BusinessDetailsStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 4 ? (
            <PaymentSettlementStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 5 ? (
            <DeliverySettingsStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : (
            <LaunchReviewStep form={form} onBack={back} onLaunch={handleLaunchShop} />
          )}
        </div>
      </main>
    </div>
  );
}
