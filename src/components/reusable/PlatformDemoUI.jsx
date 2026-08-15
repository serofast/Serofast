import { useState, useEffect } from "react";
import { Terminal, Monitor, ShoppingBag, Settings, CheckCircle2, Play, RefreshCw, Sparkles, Copy, Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function PlatformDemoUI() {
  const [activeTab, setActiveTab] = useState("terminal");
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    "🚀 Initializing SeroFast Store engine v2.4...",
    "📦 Reading store metadata: 'Urban Styles Minimal'",
    "⚡ Registering ₹50 merchant account...",
    "✅ Storefront deployed instantly at https://serofast.com/urban-styles",
    "🔔 [LIVE STREAM] Customer #4092 placed order for 'Men's Casual Shirt' (₹999)",
    "🚚 Dispatching local student runner... Estimated delivery: 28 mins",
    "✨ 100% Margin payout ₹999 transferred via instant UPI!",
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateNewOrder = () => {
    setIsSimulating(true);
    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const times = ["22 mins", "35 mins", "18 mins", "40 mins"];
    const items = ["Sports Sneakers", "Smart Watch", "Glow Beauty Set", "Casual Linen Shirt"];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `🔔 [LIVE STREAM] New Order #${newOrderNumber} received for '${randomItem}'`,
        `🚚 Partner runner assigned. ETA: ${randomTime}`,
        `💰 Instant settlement ₹${Math.floor(800 + Math.random() * 2000)} credited to bank!`,
      ]);
      setIsSimulating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("npx create-serofast-shop@latest");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "terminal", label: "Terminal Output", icon: Terminal },
    { id: "preview", label: "Store Preview", icon: Monitor },
    { id: "orders", label: "Live Order Stream", icon: ShoppingBag },
    { id: "config", label: "Store Config", icon: Settings },
  ];

  return (
    <section className="relative w-full bg-white py-16 sm:py-20 lg:py-24" id="demo">
      <div className="mx-auto w-[min(1280px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/20 bg-promoHighlight px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-xs">
            <Sparkles size={14} className="text-brandRed" />
            <span>INTERACTIVE PLATFORM DEMO</span>
          </div>

          <h2 className="mt-4 text-[clamp(28px,3.6vw,44px)] font-extrabold leading-[1.12] tracking-tight text-textPrimary">
            Experience the SeroFast Merchant Engine
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-textSecondary sm:text-[16px]">
            Watch how fast local stores go live, process instant digital customer orders, and dispatch local deliveries in real time.
          </p>
        </ScrollReveal>

        {/* Demo Window Widget */}
        <ScrollReveal variant="scale-up" delay={150} className="mx-auto mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-gray-800 bg-[#0f172a] shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
            {/* Window Header Bar */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/90" />
                <span className="h-3 w-3 rounded-full bg-amber-500/90" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
                <span className="ml-2 text-xs font-semibold text-slate-400">serofast-cli v2.4.0 — shop-runner</span>
              </div>

              {/* Quick CLI command pill */}
              <div className="mt-2 sm:mt-0 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-xs text-slate-300">
                <span className="font-mono text-emerald-400">$ npx create-serofast-shop</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Copy CLI command"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Application-like State Tabs Bar */}
            <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 px-4 pt-2 text-xs font-semibold scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-2 px-4 py-2.5 transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "border-brandRed text-white bg-slate-900/60 rounded-t-lg"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                    }`}
                  >
                    <Icon size={14} className={isActive ? "text-brandRed" : "text-slate-500"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[300px] p-4 font-mono text-xs text-slate-200 sm:p-6">
              {/* 1. Terminal Log Tab */}
              {activeTab === "terminal" && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-sans">
                    <span className="text-slate-400 text-xs">Live Console Output</span>
                    <button
                      type="button"
                      onClick={simulateNewOrder}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 rounded-lg bg-brandRed px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-brandRedDark active:scale-95 disabled:opacity-50"
                    >
                      <Play size={12} />
                      <span>{isSimulating ? "Processing..." : "Simulate Incoming Order"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {terminalLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="animate-fade-in flex items-start gap-2 text-slate-300"
                      >
                        <span className="text-brandRed select-none">›</span>
                        <span className="leading-relaxed">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Store Preview Tab */}
              {activeTab === "preview" && (
                <div className="font-sans space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-brandRed/20 text-brandRed grid place-items-center font-bold text-base">
                          US
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">Urban Styles Storefront</h4>
                          <span className="text-xs text-emerald-400 font-semibold">● Active (0% Commission Mode)</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                        ₹50 Store Lifetime
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Digital shop catalog synced across 12 neighborhood residential zones.
                    </p>
                  </div>
                </div>
              )}

              {/* 3. Live Order Stream Tab */}
              {activeTab === "orders" && (
                <div className="font-sans space-y-3">
                  <div className="hidden sm:flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span>Order ID</span>
                    <span>Customer</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-slate-900 p-3 text-xs sm:flex sm:items-center sm:justify-between sm:gap-0">
                      <span className="font-mono text-slate-300">#SF-1092</span>
                      <span className="text-right font-bold text-white sm:text-left">₹1,499</span>
                      <span className="col-span-2 min-w-0 truncate text-slate-300 sm:col-auto">Rahul K. (Campus Hostel 4)</span>
                      <span className="col-span-2 justify-self-start sm:col-auto rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-400 font-semibold">
                        Delivered in 24m
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-slate-900 p-3 text-xs sm:flex sm:items-center sm:justify-between sm:gap-0">
                      <span className="font-mono text-slate-300">#SF-1093</span>
                      <span className="text-right font-bold text-white sm:text-left">₹2,499</span>
                      <span className="col-span-2 min-w-0 truncate text-slate-300 sm:col-auto">Sneha M. (Greenways Apt)</span>
                      <span className="col-span-2 justify-self-start sm:col-auto rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] text-blue-400 font-semibold">
                        Out for Delivery
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Store Config Tab */}
              {activeTab === "config" && (
                <div className="font-sans space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Instant Bank Settlement (UPI)</span>
                      <span className="text-xs text-emerald-400 font-bold">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Student Runner Dispatch</span>
                      <span className="text-xs text-emerald-400 font-bold">Automatic</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Delivery Charges for Buyers</span>
                      <span className="text-xs text-white font-bold">₹0 Free Delivery</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
