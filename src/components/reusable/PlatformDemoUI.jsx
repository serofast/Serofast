import { useState } from "react";
import { Terminal, Monitor, ShoppingBag, Settings, Play, Sparkles, Copy, Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function PlatformDemoUI() {
  const [activeTab, setActiveTab] = useState("terminal");
  const [copied, setCopied] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    "Initializing SeroFast Store engine v2.4...",
    "Reading store metadata: 'Urban Styles Minimal'",
    "Registering merchant account...",
    "Storefront deployed at https://serofast.com/urban-styles",
    "[LIVE] Customer #4092 placed order for 'Men's Casual Shirt' (₹999)",
    "Dispatching local student runner... ETA: 28 mins",
    "100% Margin payout ₹999 transferred via instant UPI!",
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
        `[LIVE] New Order #${newOrderNumber} received for '${randomItem}'`,
        `Partner runner assigned. ETA: ${randomTime}`,
        `Instant settlement ₹${Math.floor(800 + Math.random() * 2000)} credited!`,
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
    { id: "terminal", label: "Terminal", icon: Terminal },
    { id: "preview", label: "Store Preview", icon: Monitor },
    { id: "orders", label: "Live Orders", icon: ShoppingBag },
    { id: "config", label: "Config", icon: Settings },
  ];

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24" id="demo">
      <div className="mx-auto w-[min(1320px,calc(100%_-_40px))] sm:w-[min(1320px,calc(100%_-_48px))] max-800:w-[min(680px,calc(100%_-_28px))] max-560:w-[calc(100%_-_20px)]">
        <ScrollReveal variant="fade-down" className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brandRed/15 bg-promoHighlight px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-brandRed">
            <Sparkles size={13} className="text-brandRed" />
            <span>INTERACTIVE PLATFORM DEMO</span>
          </div>

          <h2 className="mt-4 text-[clamp(24px,3.6vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#191616]">
            Experience the SeroFast Merchant Engine
          </h2>

          <p className="mt-3 text-[14px] leading-relaxed text-[#8b8282] sm:text-[15px]">
            Watch how fast local stores go live, process orders, and dispatch local deliveries in real time.
          </p>
        </ScrollReveal>

        {/* Demo Window */}
        <ScrollReveal variant="scale-up" delay={150} className="mx-auto mt-8 sm:mt-10 max-w-4xl">
          <div className="overflow-hidden rounded-[24px] border border-slate-800 bg-[#0f172a] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            {/* Window Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/90" />
                <span className="h-3 w-3 rounded-full bg-amber-500/90" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
                <span className="ml-2 text-[11px] font-semibold text-slate-400">serofast-cli v2.4.0</span>
              </div>

              <div className="mt-2 sm:mt-0 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1 text-[11px] text-slate-300">
                <span className="font-mono text-emerald-400">$ npx create-serofast-shop</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Copy"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950 px-4 pt-2 text-[11px] font-semibold [scrollbar-width:none]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "border-brandRed text-white bg-slate-900/60 rounded-t-lg"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon size={13} className={isActive ? "text-brandRed" : "text-slate-500"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[280px] p-4 font-mono text-[11px] text-slate-200 sm:p-6">
              {activeTab === "terminal" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 font-sans">
                    <span className="text-slate-400 text-[11px]">Live Console Output</span>
                    <button
                      type="button"
                      onClick={simulateNewOrder}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 rounded-lg bg-brandRed px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:bg-brandRedDark active:scale-95 disabled:opacity-50"
                    >
                      <Play size={11} />
                      <span>{isSimulating ? "Processing..." : "Simulate Order"}</span>
                    </button>
                  </div>
                  <div className="space-y-2 pt-2">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="animate-fade-in flex items-start gap-2 text-slate-300">
                        <span className="text-brandRed select-none">›</span>
                        <span className="leading-relaxed">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="font-sans space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-brandRed/20 text-brandRed grid place-items-center font-bold text-[13px]">US</div>
                        <div>
                          <h4 className="font-bold text-white text-[13px]">Urban Styles Storefront</h4>
                          <span className="text-[11px] text-emerald-400 font-semibold">● Active (0% Commission)</span>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">₹50 Lifetime</span>
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400">
                      Digital shop catalog synced across 12 residential zones.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="font-sans space-y-2">
                  <div className="hidden sm:flex items-center justify-between text-[10px] text-slate-400 pb-2 border-b border-slate-800">
                    <span>Order ID</span><span>Customer</span><span>Amount</span><span>Status</span>
                  </div>
                  {[
                    { id: "#SF-1092", amount: "₹1,499", customer: "Rahul K. (Campus Hostel 4)", status: "Delivered in 24m", statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                    { id: "#SF-1093", amount: "₹2,499", customer: "Sneha M. (Greenways Apt)", status: "Out for Delivery", statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                  ].map((order, i) => (
                    <div key={i} className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-slate-900 p-3 text-[11px] sm:flex sm:items-center sm:justify-between">
                      <span className="font-mono text-slate-300">{order.id}</span>
                      <span className="text-right font-bold text-white sm:text-left">{order.amount}</span>
                      <span className="col-span-2 min-w-0 truncate text-slate-300 sm:col-auto">{order.customer}</span>
                      <span className={`col-span-2 justify-self-start sm:col-auto rounded-md border px-2 py-0.5 text-[10px] font-semibold ${order.statusColor}`}>{order.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "config" && (
                <div className="font-sans space-y-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2.5">
                    {[
                      { label: "Instant Bank Settlement (UPI)", value: "Enabled", color: "text-emerald-400" },
                      { label: "Student Runner Dispatch", value: "Automatic", color: "text-emerald-400" },
                      { label: "Delivery Charges for Buyers", value: "₹0 Free", color: "text-white" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-300 font-medium">{item.label}</span>
                        <span className={`text-[11px] font-bold ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
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
