import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, X } from "lucide-react";

import OnboardingHeader from "./OnboardingHeader";
import ProgressSteps from "./ProgressSteps";
import BasicShopDetailsStep from "./BasicShopDetailsStep";
import SellerInfoStep from "./SellerInfoStep";
import ProductSelectionStep from "./ProductSelectionStep";
import PaymentSettlementStep from "./PaymentSettlementStep";
import LaunchReviewStep from "./LaunchReviewStep";
import { createShopInSupabase } from "../../lib/supabase";

const STEP_PATHS = {
  1: "/create-shop",
  2: "/create-shop/step2",
  3: "/create-shop/step3",
  4: "/create-shop/step4",
  5: "/create-shop/step5",
};

const PATH_TO_STEP = {
  "/create-shop": 1,
  "/create-shop/step2": 2,
  "/create-shop/step3": 3,
  "/create-shop/step4": 4,
  "/create-shop/step5": 5,
  "/create-shop/details": 1,
  "/create-shop/products": 3,
  "/create-shop/launch": 5,
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
  city: "",
  state: "",
  pincode: "",
  logo: null,
  cover: null,
  selectedProducts: [],
};

export default function CreateShopPage({ onClose, onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();
  const step = PATH_TO_STEP[location.pathname] || 1;
  const [form, setForm] = useState(initialForm);
  const [showExitModal, setShowExitModal] = useState(false);

  const updateForm = (patch) => setForm((c) => ({ ...c, ...patch }));
  const next = () => navigate(STEP_PATHS[Math.min(5, step + 1)]);
  const back = () => navigate(STEP_PATHS[Math.max(1, step - 1)]);

  const handleOpenExitModal = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    if (onClose) {
      onClose();
      return;
    }
    navigate("/shop-owner/dashboard");
  };

  const handleLaunchShop = async () => {
    const newShop = await createShopInSupabase(form);
    if (onComplete) onComplete(newShop);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-slate-900 font-sans">
      <OnboardingHeader onClose={handleOpenExitModal} />

      <main className="min-h-[calc(100svh-64px)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
          <ProgressSteps step={step} />

          {step === 1 ? (
            <BasicShopDetailsStep form={form} updateForm={updateForm} onNext={next} />
          ) : step === 2 ? (
            <SellerInfoStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 3 ? (
            <ProductSelectionStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 4 ? (
            <PaymentSettlementStep onNext={next} onBack={back} />
          ) : (
            <LaunchReviewStep form={form} onBack={back} onLaunch={handleLaunchShop} />
          )}
        </div>
      </main>

      {/* Exit Confirmation Dialog Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in font-sans">
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-scale-up space-y-5"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-brandRed border border-rose-100">
                <AlertCircle size={24} />
              </div>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Exit Shop Setup?</h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5 leading-relaxed">
                Are you sure you want to leave? Any details entered in this session will not be saved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                className="min-h-[48px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Stay &amp; Continue
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="min-h-[48px] flex-1 rounded-2xl bg-rose-600 px-4 text-xs font-bold text-white shadow-md shadow-rose-500/20 hover:bg-rose-700 transition cursor-pointer"
              >
                Exit Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
