import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Rocket } from "lucide-react";

import OnboardingHeader from "./OnboardingHeader";
import ProgressSteps from "./ProgressSteps";
import BenefitCard from "./BenefitCard";
import ShopDetailsStep from "./ShopDetailsStep";
import ProductSelectionStep from "./ProductSelectionStep";
import LaunchReviewStep from "./LaunchReviewStep";
import { benefits } from "./data";
import { formatINR } from "./utils";

const STEP_PATHS = {
  1: "/create-shop",
  2: "/create-shop/details",
  3: "/create-shop/products",
  4: "/create-shop/launch",
};

const PATH_TO_STEP = {
  "/create-shop": 1,
  "/create-shop/details": 2,
  "/create-shop/products": 3,
  "/create-shop/launch": 4,
};

const initialForm = {
  shopName: "",
  category: "",
  subCategory: "",
  description: "",
  email: "",
  contact: "",
  entryFee: "offer",
  logo: null,
  cover: null,
};

export default function CreateShopPage({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const step = PATH_TO_STEP[location.pathname] || 1;

  // Single source of truth for the whole flow. Lives here (not per route),
  // so navigating between steps never resets the user's data.
  const [form, setForm] = useState(initialForm);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [launched, setLaunched] = useState(false);

  const updateForm = (patch) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const next = () => {
    navigate(STEP_PATHS[Math.min(4, step + 1)]);
  };

  const back = () => {
    navigate(STEP_PATHS[Math.max(1, step - 1)]);
  };

  const toggleProduct = (product, sellingPrice) => {
    setSelectedProducts((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, { ...product, sellingPrice }]
    );
  };

  const updateSellingPrice = (id, sellingPrice) => {
    setSelectedProducts((current) =>
      current.map((item) => (item.id === id ? { ...item, sellingPrice } : item))
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts((current) => current.filter((item) => item.id !== id));
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    navigate("/");
  };

  const restart = () => {
    setForm(initialForm);
    setSelectedProducts([]);
    setLaunched(false);
    navigate("/create-shop");
  };

  const entryFee = form.entryFee === "standard" ? 50 : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-lightBackground text-textPrimary">
      <OnboardingHeader step={step} onClose={handleClose} />

      <main className="min-h-[calc(100svh-64px)]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6 lg:px-8 lg:py-10">
          {!launched && <ProgressSteps step={step} />}

          {launched ? (
            <section className="mx-auto max-w-2xl py-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-promoHighlight text-brandRed">
                <Rocket size={30} />
              </div>

              <h1 className="mt-5 text-2xl font-bold md:text-3xl lg:text-4xl">
                Your shop is ready to launch!
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-textSecondary md:text-base">
                <strong className="text-textPrimary">“{form.shopName || "Your Shop"}”</strong>{" "}
                is set up with {selectedProducts.length}{" "}
                {selectedProducts.length === 1 ? "product" : "products"} and an entry charge of{" "}
                {formatINR(entryFee)}.
              </p>

              <div className="mx-auto mt-7 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-lg bg-brandRed px-6 text-sm font-semibold text-white transition hover:bg-brandRedDark"
                >
                  Back to Home
                </button>
                <button
                  type="button"
                  onClick={restart}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-lg border border-[#d9d9d9] bg-lightSurface px-6 text-sm font-semibold text-textPrimary transition hover:border-brandRed hover:text-brandRed"
                >
                  Create Another Shop
                </button>
              </div>

              <p className="mt-6 text-xs text-textMuted">
                Frontend-only preview — no backend is connected yet, so no shop has been created
                remotely.
              </p>
            </section>
          ) : step === 1 ? (
            <section>
              <div className="mb-8 text-center lg:mb-10">
                <h1 className="m-0 text-2xl font-bold md:text-3xl lg:text-4xl">
                  Why Join SeroFast?
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-sm text-textSecondary lg:text-base">
                  Unlimited opportunities to learn, grow and earn.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
                {benefits.map((benefit) => (
                  <BenefitCard key={benefit.title} benefit={benefit} />
                ))}
              </div>

              <div className="mt-8 flex justify-end lg:mt-10">
                <button
                  type="button"
                  onClick={next}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brandRed px-6 py-3 text-sm font-semibold text-white transition hover:bg-brandRedDark md:w-auto"
                >
                  Continue to Shop Details
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          ) : step === 2 ? (
            <ShopDetailsStep form={form} updateForm={updateForm} onNext={next} onBack={back} />
          ) : step === 3 ? (
            <ProductSelectionStep
              selectedProducts={selectedProducts}
              onToggleProduct={toggleProduct}
              onUpdatePrice={updateSellingPrice}
              onNext={next}
              onBack={back}
            />
          ) : (
            <LaunchReviewStep
              form={form}
              selectedProducts={selectedProducts}
              onUpdatePrice={updateSellingPrice}
              onRemoveProduct={removeProduct}
              onBack={back}
              onLaunch={() => setLaunched(true)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
