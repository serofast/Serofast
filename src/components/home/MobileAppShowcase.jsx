import { useState, useEffect, useRef } from "react";
import {
  Store,
  Truck,
  Wallet,
  MessageSquare,
  BarChart3,
  Share2,
  CheckCircle2,
  CreditCard,
  Check,
  Download,
  ExternalLink,
  Smartphone,
  PhoneCall,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

export const APP_VIEWS = [
  {
    id: "storefront",
    name: "Student Storefront",
    icon: Store,
    badge: "Core Commerce",
    title: "Launch a Personalized Campus Shop in Under 2 Minutes",
    description:
      "Pick trending products from the SeroFast central catalogue, set your own profit margin on each item, and get a custom shop link ready to share on WhatsApp and Instagram.",
    highlights: [
      "Zero inventory to purchase upfront — SeroFast stocks everything",
      "Custom profit margin slider on every single product",
      "Instant WhatsApp status card and Instagram story link generator",
      "Custom branded store URL (e.g. serofast.in/mystore)",
    ],
    screenBadge: "Shop Profile",
  },
  {
    id: "tracking",
    name: "Live GPS Order Tracking",
    icon: Truck,
    badge: "Managed Logistics",
    title: "Real-Time Tracking from Sourcing to Hostel Doorstep",
    description:
      "Both sellers and campus customers track every parcel live with automated SMS/WhatsApp alerts, campus runner contact, and precise delivery ETA.",
    highlights: [
      "5-stage order timeline: Ordered → Sourced → Packed → Dispatched → Delivered",
      "Direct phone & WhatsApp button to connect with assigned campus runner",
      "Hostel room & department delivery routing",
      "Digital OTP verification upon doorstep handover",
    ],
    screenBadge: "Live Order #SF-8291",
  },
  {
    id: "wallet",
    name: "Instant Earnings & UPI Wallet",
    icon: Wallet,
    badge: "Fast Payouts",
    title: "100% Margin Kept. Instant 1-Tap Withdrawal to Any UPI",
    description:
      "Your earnings appear in your digital ledger the moment an order is fulfilled. Withdraw anytime directly to Google Pay, PhonePe, Paytm or your bank account with ₹0 commission.",
    highlights: [
      "100% of your marked-up margin goes into your account",
      "Instant UPI settlements with zero lock-in period",
      "Detailed breakdown of gross sales, net margin, and settled payouts",
      "Downloadable financial statements for student entrepreneur portfolios",
    ],
    screenBadge: "My Earnings Wallet",
  },
  {
    id: "chat",
    name: "In-App Customer Chat",
    icon: MessageSquare,
    badge: "Social Commerce",
    title: "Direct Buyer-to-Seller Messaging & Campus Bargaining",
    description:
      "Engage with college classmates, answer sizing or specification questions, send direct product recommendation cards, and offer exclusive campus discounts.",
    highlights: [
      "Direct encrypted messaging between student sellers and campus buyers",
      "1-tap product recommendation card sharing inside chat",
      "Custom discount coupon creator for friend circles and group buys",
      "Customer reviews and star ratings displayed in real time",
    ],
    screenBadge: "Campus Chat",
  },
  {
    id: "analytics",
    name: "Real-Time Shop Analytics",
    icon: BarChart3,
    badge: "Smart Growth",
    title: "Data-Driven Insights to Grow Your Campus Sales",
    description:
      "Understand what products your campus peers are browsing, view peak shopping hours, and track repeat customers directly from your pocket.",
    highlights: [
      "Real-time visitors counter and link clicks from social media",
      "Top selling products and high-margin conversion analysis",
      "Repeat customer metrics across college departments",
      "Automated tips to optimize your pricing for college budgets",
    ],
    screenBadge: "Growth Insights",
  },
];

export default function MobileAppShowcase({ onShowToast }) {
  const [activeTab, setActiveTab] = useState(APP_VIEWS[0].id);
  const [inAppSimState, setInAppSimState] = useState("");
  const containerRef = useRef(null);
  const phoneRef = useRef(null);
  const contentRef = useRef(null);

  // Synchronized scroll animation:
  // Mobile phone glides UP from below, while the Core Commerce content slides IN from the RIGHT.
  // Both move simultaneously in direct 1:1 sync with the user's scroll.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current && phoneRef.current && contentRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Start animation when section enters viewport, complete when nicely centered
            const startScroll = windowHeight * 0.95;
            const endScroll = windowHeight * 0.15;
            const progress = Math.min(
              1,
              Math.max(0, (startScroll - rect.top) / (startScroll - endScroll))
            );

            // Phone glides UP from below as user scrolls down
            const phoneTranslateY = (1 - progress) * 110;
            const phoneOpacity = 0.15 + progress * 0.85;
            phoneRef.current.style.transform = `translate3d(0, ${phoneTranslateY}px, 0)`;
            phoneRef.current.style.opacity = `${phoneOpacity}`;

            // Core Commerce content slides IN from the RIGHT as user scrolls down
            const contentTranslateX = (1 - progress) * 120;
            const contentOpacity = 0.15 + progress * 0.85;
            contentRef.current.style.transform = `translate3d(${contentTranslateX}px, 0, 0)`;
            contentRef.current.style.opacity = `${contentOpacity}`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentView = APP_VIEWS.find((v) => v.id === activeTab) || APP_VIEWS[0];

  const handleTabChange = (id, name) => {
    setActiveTab(id);
    setInAppSimState("");
    if (onShowToast) onShowToast(`Switched to ${name} in app preview`);
  };

  // Simulated interactive actions inside phone
  const triggerInAppAction = (msg) => {
    setInAppSimState(msg);
    if (onShowToast) onShowToast(msg);
    setTimeout(() => setInAppSimState(""), 2600);
  };

  return (
    <section
      id="app-preview"
      ref={containerRef}
      className="relative border-b border-[#EBE3DC] bg-[#FAF8F5]/80 py-12 lg:py-16 select-none overflow-hidden vivo-perspective-container"
    >
      {/* Soft ambient lighting — clean light aesthetic */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-brandRed/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-rose-200/25 blur-3xl" />

      <div className="relative mx-auto w-[min(1400px,calc(100%_-_32px))]">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mt-1 text-[clamp(1.9rem,3.6vw,2.9rem)] font-black tracking-tight text-[#191616]">
            Explore What SeroFast Powers on Your Phone
          </h2>

          <p className="mt-2 text-sm text-[#555] sm:text-base max-w-[620px] mx-auto">
            Experience the live mobile interface. Interact directly with the phone to explore your campus storefront, live tracking, and instant earnings.
          </p>
        </div>

        {/* Main Stage: Sleek Ceramic White & Silver Smartphone + Narrative */}
        <div className="mt-9 grid grid-cols-1 items-center gap-8 lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr]">
          {/* Left: Ceramic White & Silver Smartphone with Parallel Scroll Lift */}
          <div className="flex justify-center">
            <div
              ref={phoneRef}
              style={{
                willChange: "transform, opacity",
                transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
              }}
              className="vivo-device-chassis relative w-[310px] sm:w-[335px] rounded-[48px] border-[9px] border-slate-200/95 bg-white p-2 shadow-[0_25px_60px_rgba(211,47,47,0.12)] ring-1 ring-slate-300/70"
            >
              {/* Dynamic Island / Speaker Pill */}
              <div className="absolute left-1/2 top-4 -translate-x-1/2 z-30 flex h-4 w-22 items-center justify-center rounded-full bg-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500 mr-2" />
                <span className="h-2 w-2 rounded-full bg-slate-800" />
              </div>

              {/* Inside Phone Screen */}
              <div className="relative h-[580px] w-full overflow-hidden rounded-[38px] bg-slate-50 flex flex-col justify-between select-none border border-slate-100">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-bold text-slate-700 bg-white/70 backdrop-blur-xs">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-500">5G</span>
                    <div className="h-2.5 w-4 rounded-sm border border-slate-600 p-0.5 flex items-center">
                      <div className="h-full w-full bg-slate-700 rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* App Header Inside Phone */}
                <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-md bg-brandRed flex items-center justify-center text-white text-[9px] font-black">
                      SF
                    </div>
                    <span className="text-xs font-black text-brandRed">SeroFast</span>
                  </div>
                  <span className="rounded-full bg-red-50 border border-red-200/60 px-2 py-0.5 text-[9px] font-black text-brandRed">
                    {currentView.screenBadge}
                  </span>
                </div>

                {/* In-App Simulated Toast Alert */}
                {inAppSimState && (
                  <div className="mx-3 mt-2 rounded-lg bg-brandRed px-2.5 py-1.5 text-[10px] font-bold text-white text-center shadow-md animate-in fade-in slide-in-from-top-2">
                    {inAppSimState}
                  </div>
                )}

                {/* Dynamic Screen Body with smooth card transitions */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 [scrollbar-width:none]">
                  {/* VIEW 1: STOREFRONT */}
                  {activeTab === "storefront" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-3.5 text-white shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-white text-brandRed font-black flex items-center justify-center text-xs shadow-xs">
                            S
                          </div>
                          <div>
                            <div className="text-xs font-black">Campus Smart Store</div>
                            <div className="text-[10px] text-white/90">Campus Reseller • 4.8 ★ (500+ orders)</div>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between text-[10px] bg-white/15 rounded-lg px-2.5 py-1.5 backdrop-blur-xs">
                          <span className="font-medium">serofast.in/mystore</span>
                          <button
                            type="button"
                            onClick={() => triggerInAppAction("Link copied to clipboard! 📋")}
                            className="font-bold underline cursor-pointer hover:text-red-100"
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerInAppAction("WhatsApp status poster generated! 🚀")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-[11px] font-bold text-white shadow-xs transition hover:bg-slate-800 active:scale-95 cursor-pointer"
                      >
                        <Share2 size={12} />
                        <span>Share Store to WhatsApp Status</span>
                      </button>

                      <div className="text-[11px] font-black text-[#191616]">Active Campus Items</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          onClick={() => triggerInAppAction("Selected boAt Airdopes 141 (₹150 profit)")}
                          className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xs hover:border-brandRed/40 transition-all cursor-pointer hover:scale-102"
                        >
                          <img src="/landing/product-earbuds.png" alt="" className="h-14 w-full object-contain" />
                          <div className="text-[10px] font-bold truncate mt-1 text-[#222]">boAt Airdopes 141</div>
                          <div className="flex items-center justify-between text-[10px] mt-0.5">
                            <span className="font-black text-brandRed">₹1,299</span>
                            <span className="text-[8.5px] bg-emerald-50 text-emerald-700 px-1 font-extrabold rounded border border-emerald-200">
                              +₹150 Profit
                            </span>
                          </div>
                        </div>
                        <div
                          onClick={() => triggerInAppAction("Selected Smart Watch BT (₹250 profit)")}
                          className="rounded-xl border border-slate-200 bg-white p-2 shadow-2xs hover:border-brandRed/40 transition-all cursor-pointer hover:scale-102"
                        >
                          <img src="/landing/product-watch.png" alt="" className="h-14 w-full object-contain" />
                          <div className="text-[10px] font-bold truncate mt-1 text-[#222]">Smart Watch BT</div>
                          <div className="flex items-center justify-between text-[10px] mt-0.5">
                            <span className="font-black text-brandRed">₹1,999</span>
                            <span className="text-[8.5px] bg-emerald-50 text-emerald-700 px-1 font-extrabold rounded border border-emerald-200">
                              +₹250 Profit
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 2: LIVE TRACKING */}
                  {activeTab === "tracking" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-black text-emerald-800">Order Out for Delivery</span>
                          <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[9px] font-bold">
                            ETA: 18 mins
                          </span>
                        </div>
                        <div className="text-[10px] text-emerald-700 mt-1">
                          Campus Runner heading to Hostel Block B, Room 204
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 text-[11px] shadow-2xs">
                        <div className="flex items-center gap-2.5 text-emerald-600 font-bold">
                          <CheckCircle2 size={14} />
                          <span>Order Confirmed (10:15 AM)</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-emerald-600 font-bold">
                          <CheckCircle2 size={14} />
                          <span>Packed &amp; Verified at Central Hub</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-brandRed font-black">
                          <div className="h-3.5 w-3.5 rounded-full bg-brandRed flex items-center justify-center text-white text-[8px]">
                            ●
                          </div>
                          <span>Campus Runner on the way</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[#999]">
                          <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                          <span>Doorstep Handover (OTP: 4892)</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-3 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-700 ring-1 ring-slate-200">
                            AK
                          </div>
                          <div>
                            <div className="text-[11px] font-black text-[#222]">Arun K. (Runner)</div>
                            <div className="text-[9px] text-[#777]">Campus Delivery Partner • 4.9 ★</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerInAppAction("Connecting to Arun K... 📞")}
                          className="rounded-lg bg-brandRed text-white px-2.5 py-1 text-[10px] font-bold hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
                        >
                          Call Runner
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 3: EARNINGS WALLET */}
                  {activeTab === "wallet" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-500 to-rose-600 p-4 text-white shadow-sm">
                        <div className="text-[10px] font-bold text-white/80">Total Margin Profit Earned</div>
                        <div className="text-2xl font-black text-white mt-0.5">₹14,850.00</div>
                        <div className="mt-3 flex items-center justify-between border-t border-white/20 pt-2 text-[10px]">
                          <span className="text-white/90">Available to Withdraw:</span>
                          <span className="font-extrabold bg-white text-brandRed px-2 py-0.5 rounded-md">
                            ₹3,450.00
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => triggerInAppAction("₹3,450 successfully transferred to UPI! 💸")}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brandRed py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brandRedDark transition active:scale-95 cursor-pointer"
                      >
                        <CreditCard size={13} />
                        <span>Instant 1-Tap Withdrawal (UPI)</span>
                      </button>

                      <div className="text-[11px] font-black text-[#191616]">Recent Payouts</div>
                      <div className="space-y-1.5">
                        <div className="rounded-xl border border-slate-200 bg-white p-2.5 flex items-center justify-between text-[10px] shadow-2xs">
                          <div>
                            <div className="font-bold text-[#222]">boAt Airdopes Sale</div>
                            <div className="text-[9px] text-[#888]">Order #SF-8120 • Just now</div>
                          </div>
                          <span className="font-black text-brandRed">+₹150.00</span>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-2.5 flex items-center justify-between text-[10px] shadow-2xs">
                          <div>
                            <div className="font-bold text-[#222]">Nike Shoes Margin</div>
                            <div className="text-[9px] text-[#888]">Order #SF-8098 • Yesterday</div>
                          </div>
                          <span className="font-black text-brandRed">+₹450.00</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* VIEW 4: CHAT */}
                  {activeTab === "chat" && (
                    <div className="space-y-2.5 animate-in fade-in duration-200 text-[11px]">
                      <div className="rounded-xl bg-slate-200/50 p-1.5 text-center text-[9px] text-[#666]">
                        Today, 11:20 AM • Campus Direct Chat
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-6 w-6 rounded-full bg-rose-100 text-brandRed font-bold flex items-center justify-center text-[10px] shrink-0">
                          P
                        </div>
                        <div className="rounded-2xl rounded-tl-xs bg-white p-2.5 border border-slate-200 max-w-[80%] text-[10px] text-[#222] shadow-2xs">
                          Hey! Is the mechanical keyboard available for delivery to Hostel 3?
                        </div>
                      </div>
                      <div className="flex items-start gap-2 justify-end">
                        <div className="rounded-2xl rounded-tr-xs bg-brandRed p-2.5 text-white max-w-[80%] text-[10px] shadow-2xs">
                          Yes Priya! I have 2 left in stock. I can get our campus runner to drop it by 2 PM! 🚀
                        </div>
                      </div>
                      <div className="rounded-xl border border-red-200 bg-red-50/80 p-2 flex items-center justify-between">
                        <span className="text-[9.5px] font-bold text-brandRed">Special Campus Offer: ₹2,199</span>
                        <button
                          type="button"
                          onClick={() => triggerInAppAction("Special offer applied to cart! 🎟️")}
                          className="text-[8px] bg-brandRed text-white px-2 py-0.5 rounded font-bold hover:bg-brandRedDark transition cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  )}

                  {/* VIEW 5: ANALYTICS */}
                  {activeTab === "analytics" && (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
                          <div className="text-[#888]">Today's Visitors</div>
                          <div className="text-base font-black text-[#191616] mt-0.5">284</div>
                          <span className="text-[8.5px] text-emerald-600 font-extrabold">+18% vs yesterday</span>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs">
                          <div className="text-[#888]">Orders Placed</div>
                          <div className="text-base font-black text-brandRed mt-0.5">14</div>
                          <span className="text-[8.5px] text-emerald-600 font-extrabold">₹4,280 gross</span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                        <div className="text-[10px] font-bold text-[#444]">Top Selling Category</div>
                        <div className="mt-2 space-y-1 text-[9px]">
                          <div className="flex justify-between">
                            <span>Electronics &amp; Audio</span>
                            <span className="font-bold">62%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brandRed rounded-full w-[62%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom App Navigation inside phone */}
                <div className="grid grid-cols-5 border-t border-slate-200 bg-white py-1.5 px-1 text-center text-[8px] font-bold text-[#777]">
                  <button
                    type="button"
                    onClick={() => handleTabChange("storefront", "Storefront")}
                    className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                      activeTab === "storefront" ? "text-brandRed font-black" : "hover:text-[#333]"
                    }`}
                  >
                    <Store size={14} className={activeTab === "storefront" ? "text-brandRed" : "text-slate-400"} />
                    <span className="mt-0.5">Shop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("tracking", "Live Tracking")}
                    className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                      activeTab === "tracking" ? "text-brandRed font-black" : "hover:text-[#333]"
                    }`}
                  >
                    <Truck size={14} className={activeTab === "tracking" ? "text-brandRed" : "text-slate-400"} />
                    <span className="mt-0.5">Track</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("wallet", "Wallet")}
                    className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                      activeTab === "wallet" ? "text-brandRed font-black" : "hover:text-[#333]"
                    }`}
                  >
                    <Wallet size={14} className={activeTab === "wallet" ? "text-brandRed" : "text-slate-400"} />
                    <span className="mt-0.5">Wallet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("chat", "Chat")}
                    className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                      activeTab === "chat" ? "text-brandRed font-black" : "hover:text-[#333]"
                    }`}
                  >
                    <MessageSquare size={14} className={activeTab === "chat" ? "text-brandRed" : "text-slate-400"} />
                    <span className="mt-0.5">Chat</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabChange("analytics", "Analytics")}
                    className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
                      activeTab === "analytics" ? "text-brandRed font-black" : "hover:text-[#333]"
                    }`}
                  >
                    <BarChart3 size={14} className={activeTab === "analytics" ? "text-brandRed" : "text-slate-400"} />
                    <span className="mt-0.5">Insights</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Feature Narrative & Direct Value */}
          <div
            ref={contentRef}
            style={{
              willChange: "transform, opacity",
              transition: "transform 0.08s ease-out, opacity 0.08s ease-out",
            }}
            className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-brandRed/30 hover:shadow-lg"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-brandRed">
              <currentView.icon size={13} />
              <span>{currentView.badge}</span>
            </div>

            <h3 className="mt-3 text-2xl font-black text-[#191616] sm:text-3xl">
              {currentView.title}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-[#555] sm:text-base">
              {currentView.description}
            </p>

            {/* Checklist with staggered animated reveals */}
            <div className="mt-6 space-y-3">
              {currentView.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 transition-transform hover:translate-x-1">
                  <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-red-100 text-brandRed">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold text-[#333] sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions with Button Micro-Interactions */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-[#F0EBE6]">
              <a
                href="#download-app"
                className="group inline-flex items-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-xs font-black text-white shadow-md shadow-brandRed/20 transition-all duration-200 hover:-translate-y-1 hover:bg-brandRedDark active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                <span>Download App to Try Feature</span>
              </a>

              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#D5D9D9] bg-white px-5 py-3 text-xs font-bold text-[#333] transition-all duration-200 hover:-translate-y-1 hover:border-brandRed/40 hover:text-brandRed active:scale-95"
              >
                <span>Register as Student Seller</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
