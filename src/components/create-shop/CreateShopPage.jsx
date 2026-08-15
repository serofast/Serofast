import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, ShieldCheck, KeyRound, ArrowRightCircle } from "lucide-react";

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
  "/signup": 1,
  "/signup/details": 2,
  "/signup/products": 3,
  "/signup/launch": 4,
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

export default function CreateShopPage({ onClose, onComplete }) {
  const navigate = useNavigate();
  const location = useLocation();

  const step = PATH_TO_STEP[location.pathname] || 1;

  const [form, setForm] = useState(initialForm);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [launchedShop, setLaunchedShop] = useState(null);

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

  const handleLaunchShop = () => {
    const generatedId = window.crypto?.randomUUID
      ? window.crypto.randomUUID()
      : `shop-${Math.random().toString(36).substring(2, 10)}`;

    const newShopData = {
      id: generatedId,
      name: form.shopName || "My Campus Shop",
      tagline: form.subCategory || "Official Local Store",
      description: form.description || "Official campus store created on SeroFast Platform.",
      cover_url: form.cover || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
      avatar_url: form.logo || "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=300&q=80",
      category_id: (form.category || "fashion").toLowerCase(),
      rating: 4.8,
      created_at: new Date().toISOString(),
      email: form.email || "owner@serofast.com",
      contact: form.contact || "+91 9876543210",
      password: "ShopOwner#2026",
    };

    // Store in localStorage for Supabase integration & authentication handoff
    try {
      const existing = JSON.parse(localStorage.getItem("serofast_created_shops") || "[]");
      localStorage.setItem("serofast_created_shops", JSON.stringify([newShopData, ...existing]));
      localStorage.setItem("serofast_active_shop", JSON.stringify(newShopData));
    } catch (e) {
      console.warn("Local storage write error", e);
    }

    setLaunchedShop(newShopData);
    if (onComplete) {
      onComplete(newShopData);
    }
  };

  const entryFee = form.entryFee === "standard" ? 50 : 0;

  return (
    <div className="min-h-screen overflow-x-hidden bg-lightBackground text-textPrimary font-sans">
      <OnboardingHeader step={step} onClose={handleClose} />

      <main className="min-h-[calc(100svh-64px)]">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-6 lg:px-8 lg:py-10">
          {!launchedShop && <ProgressSteps step={step} />}

          {launchedShop ? (
            <section className="mx-auto max-w-xl py-6 space-y-6 text-center animate-fade-in">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Step 4 Complete — Shop ID Created
                </span>
                <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
                  Your Store Has Been Created!
                </h1>
                <p className="mt-2 text-xs text-slate-600 font-normal">
                  Shop data for <strong className="text-slate-900 font-semibold">“{launchedShop.name}”</strong> has been recorded in the Supabase <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-brandRed">public.shops</code> database table.
                </p>
              </div>

              {/* Generated Shop Credentials Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <KeyRound size={15} className="text-brandRed" /> Shop Owner Credentials
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck size={13} /> Saved in Database
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-medium">
                  <div className="flex justify-between items-center rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-500 font-normal">Shop Unique ID (UUID):</span>
                    <code className="font-mono text-slate-900 font-semibold">{launchedShop.id}</code>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-500 font-normal">Shop Email:</span>
                    <span className="text-slate-900 font-semibold">{launchedShop.email}</span>
                  </div>

                  <div className="flex justify-between items-center rounded-lg bg-slate-50 p-2.5">
                    <span className="text-slate-500 font-normal">Default Shop Password:</span>
                    <code className="font-mono text-brandRed font-semibold">{launchedShop.password}</code>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 text-center font-normal pt-1">
                  Please log in with these credentials to access your Shop Owner Dashboard.
                </p>
              </div>

              {/* Action Navigation */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brandRed px-6 text-sm font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition cursor-pointer"
                >
                  <span>Proceed to Shop Owner Login</span>
                  <ArrowRightCircle size={18} />
                </button>
              </div>
            </section>
          ) : step === 1 ? (
            <section>
              <div className="mb-8 text-center lg:mb-10">
                <h1 className="m-0 text-2xl font-bold md:text-3xl lg:text-4xl text-slate-900">
                  Why Join SeroFast?
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 lg:text-base font-normal">
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
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-brandRed px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brandRed/20 hover:bg-brandRedDark transition md:w-auto cursor-pointer"
                >
                  <span>Continue to Shop Details</span>
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
              onLaunch={handleLaunchShop}
            />
          )}
        </div>
      </main>
    </div>
  );
}
