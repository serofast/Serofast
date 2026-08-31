import { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coins,
  Cpu,
  CreditCard,
  DollarSign,
  ExternalLink,
  Flame,
  Globe,
  HelpCircle,
  Laptop,
  Layers,
  LineChart,
  Lock,
  MapPin,
  MoveUpRight,
  Package,
  Percent,
  Play,
  Plus,
  RefreshCw,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Footer,
  Header,
  MobileBottomNav,
  ScrollToTop,
  AppTeaserModal,
} from "./reusable";

// Sample live simulated campus stores running on SeroFast Central Hub
const VERIFIED_CAMPUS_MERCHANTS = [
  {
    name: "Urban Threads Apparel",
    category: "Streetwear & Hoodies",
    campus: "North Campus Central Hub",
    sales: "₹1,84,000 / mo",
    savedCommission: "₹40,480 saved",
    rating: "4.9",
    orders: 412,
    avatar: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80",
    badge: "Apparel Partner",
  },
  {
    name: "The Campus Grill & Cafe",
    category: "Gourmet Snacks & Shakes",
    campus: "Food Court Annex",
    sales: "₹2,65,000 / mo",
    savedCommission: "₹58,300 saved",
    rating: "4.9",
    orders: 890,
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80",
    badge: "Food & Dining",
  },
  {
    name: "Nexus Tech & Stationery",
    category: "Gadgets & Supplies",
    campus: "Library Block Hub",
    sales: "₹1,15,000 / mo",
    savedCommission: "₹25,300 saved",
    rating: "4.8",
    orders: 320,
    avatar: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format&fit=crop&q=80",
    badge: "Tech & Needs",
  },
  {
    name: "Aura Skincare & Grooming",
    category: "Hostel Essentials",
    campus: "South Campus Wing",
    sales: "₹92,000 / mo",
    savedCommission: "₹20,240 saved",
    rating: "5.0",
    orders: 195,
    avatar: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&auto=format&fit=crop&q=80",
    badge: "Self Care",
  },
];

// Interactive Fulfillment Engine Steps
const FULFILLMENT_STEPS = [
  {
    step: "01",
    title: "Register Store for ₹50 Once",
    short: "Instant Digital Setup",
    description:
      "No 15-30% recurring commissions. Pay a nominal ₹50 activation fee, upload your product catalog, and set your own retail prices in under 3 minutes.",
    icon: Store,
    badge: "Zero Commission",
    highlight: "100% Retained Margins",
  },
  {
    step: "02",
    title: "Stock SeroFast Campus Hub",
    short: "Decentralized Micro-Hub",
    description:
      "Drop your fast-moving inventory at our secure campus central warehouse. We barcode, quality check, and store items safely in real-time.",
    icon: Package,
    badge: "Zero Storage Hassle",
    highlight: "Real-Time Stock Sync",
  },
  {
    step: "03",
    title: "Automated Runner Dispatch",
    short: "Sub-30 Min Delivery",
    description:
      "When a campus student orders, our warehouse automatically packs the item and dispatches a verified student runner directly to their hostel room.",
    icon: Zap,
    badge: "Lightning Dispatch",
    highlight: "Avg 18-28 Mins",
  },
  {
    step: "04",
    title: "Instant Direct UPI Settlements",
    short: "Automated Payouts",
    description:
      "As soon as the customer receives their order, the full 100% retail amount is credited instantly to your bank account via automated UPI rails.",
    icon: Wallet,
    badge: "Same-Day Liquidity",
    highlight: "Instant Payout",
  },
];

// FAQ Data specifically for Shop Owners and Investors
const FAQS = [
  {
    category: "Shop Owners",
    question: "How does SeroFast operate with 0% commission on all sales?",
    answer:
      "Traditional aggregators charge 18% to 30% per order because of heavy dark-store leases and expensive city logistics. SeroFast operates high-density campus micro-warehouses funded by nominal one-time ₹50 seller onboarding and platform services, letting merchants keep 100% of their hard-earned retail margin.",
  },
  {
    category: "Shop Owners",
    question: "Do I need to pack or deliver orders myself?",
    answer:
      "Not at all! You simply bulk-stock your inventory at our SeroFast Campus Central Warehouse. Our automated warehouse team handles 100% of order picking, packaging, and runner dispatch directly to student hostels.",
  },
  {
    category: "Shop Owners",
    question: "How and when do I receive payouts for completed orders?",
    answer:
      "Payouts are processed instantly via automated UPI bank transfers upon delivery confirmation. There are no 14-day holdbacks or delayed settlement cycles.",
  },
  {
    category: "Shop Owners",
    question: "Can I manage inventory and update pricing in real time?",
    answer:
      "Yes! Your dedicated SeroFast Shop Owner Dashboard gives you real-time visibility over inventory stock levels, active runner dispatches, customer analytics, and daily earnings ledger.",
  },
  {
    category: "Investors & Partners",
    question: "What makes SeroFast's campus micro-warehouse model defensible?",
    answer:
      "Campus density represents the ultimate last-mile environment: 180+ orders/sq km vs 12 in suburban areas. By batching deliveries with student runners within 500-meter campus radii, our last-mile fulfillment cost is 62% lower than 3PL couriers, resulting in positive unit contribution margins from Day 1.",
  },
  {
    category: "Investors & Partners",
    question: "How fast can SeroFast expand into new university campuses?",
    answer:
      "Our micro-fulfillment playbook is fully standardized. A new campus micro-hub can be secured, merchant-stocked, and activated with local student runner networks within 7 business days with low capital expenditure.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [teaserOpen, setTeaserOpen] = useState(false);

  // Live Simulator state in Hero Merchant Mockup
  const [dashboardTab, setDashboardTab] = useState("orders");
  const [simulatedOrders, setSimulatedOrders] = useState([
    {
      id: "SF-9481",
      item: "Oversized Vintage Hoodie (L)",
      customer: "Hostel 3, Room 412",
      amount: 1249,
      status: "Dispatched",
      eta: "14 Mins",
      time: "Just now",
    },
    {
      id: "SF-9480",
      item: "Hazelnut Cold Coffee + Toast",
      customer: "Hostel 7, Block B",
      amount: 189,
      status: "Delivered",
      eta: "Settled via UPI",
      time: "6 mins ago",
    },
    {
      id: "SF-9479",
      item: "Varsity Bomber Jacket (XL)",
      customer: "Faculty Enclave 2",
      amount: 2449,
      status: "Delivered",
      eta: "Settled via UPI",
      time: "18 mins ago",
    },
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Interactive Commission & ROI Calculator State
  const [monthlyRevenue, setMonthlyRevenue] = useState(150000);
  const [aggregatorCommissionRate, setAggregatorCommissionRate] = useState(22);

  // Interactive Fulfillment Step Switcher
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Interactive FAQ filter & accordion
  const [activeFaqTab, setActiveFaqTab] = useState("All");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Auto-cycle through fulfillment steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % FULFILLMENT_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Calculated ROI Metrics
  const traditionalCommissionLostMonthly = Math.round(
    monthlyRevenue * (aggregatorCommissionRate / 100)
  );
  const traditionalAnnualLost = traditionalCommissionLostMonthly * 12;
  const serofastOneTimeFee = 50;
  const annualNetSavings = traditionalAnnualLost - serofastOneTimeFee;

  // Simulator Handler: Triggers real-time new incoming order with animation
  const handleSimulateOrder = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    const items = [
      { name: "Heavyweight Cotton Essential Tee (M)", price: 899 },
      { name: "Peri Peri Loaded Fries + Drink", price: 210 },
      { name: "Minimalist Tech Backpack 24L", price: 1699 },
      { name: "Glow & Hydrate Night Serum", price: 649 },
    ];
    const hostels = ["Hostel 1, Room 108", "Hostel 5, Wing C", "PG Tower Block A", "Hostel 2, Room 304"];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const randomHostel = hostels[Math.floor(Math.random() * hostels.length)];
    const randomId = `SF-${Math.floor(9500 + Math.random() * 499)}`;

    setTimeout(() => {
      setSimulatedOrders((prev) => [
        {
          id: randomId,
          item: randomItem.name,
          customer: randomHostel,
          amount: randomItem.price,
          status: "Dispatched",
          eta: "18 Mins",
          time: "Just now",
        },
        ...prev.slice(0, 4),
      ]);
      setIsSimulating(false);
    }, 500);
  };

  const filteredFaqs = useMemo(() => {
    if (activeFaqTab === "All") return FAQS;
    return FAQS.filter((f) => f.category === activeFaqTab);
  }, [activeFaqTab]);

  return (
    <div className="home-page min-h-screen bg-[#FAF8F5] text-[#191616] antialiased selection:bg-brandRed selection:text-white">
      {/* Sticky Header */}
      <Header
        onOpenAppTeaser={(item) => setTeaserOpen(item || "SeroFast Merchant Suite")}
        hideFreeBuffBranding
      />

      <main>
        {/* =========================================================================
            1. HERO SECTION: ULTRA-MODERN MERCHANT PLATFORM SHOWCASE
           ========================================================================= */}
        <section className="relative overflow-hidden border-b border-[#EBE3DC] bg-gradient-to-b from-[#FFF3EE] via-[#FAF8F5] to-[#FAF8F5] pt-10 pb-20 lg:pt-16 lg:pb-28">
          {/* Glowing Ambient Mesh */}
          <div className="pointer-events-none absolute -left-32 top-0 h-[550px] w-[550px] rounded-full bg-brandRed/[0.09] blur-[140px]" />
          <div className="pointer-events-none absolute right-0 top-10 h-[500px] w-[500px] rounded-full bg-amber-500/[0.07] blur-[150px]" />

          <div className="relative mx-auto w-[min(1320px,calc(100%_-_32px))]">
            {/* Top Live Ticker Badge */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brandRed/20 bg-white/90 px-4 py-1.5 text-xs font-extrabold text-brandRed shadow-sm backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandRed opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brandRed"></span>
                </span>
                <span>0% Commission Merchant Commerce Engine</span>
                <span className="hidden sm:inline-block text-[#8C7A72]">•</span>
                <span className="hidden sm:inline-block text-[#5A504B] font-bold">
                  ₹50 One-Time Setup
                </span>
              </div>

              {/* Quick Jump for Existing Orders or Customer Tracking */}
              <Link
                to="/track"
                className="group inline-flex items-center gap-1.5 rounded-full border border-[#E2D6CD] bg-white/80 px-3.5 py-1.5 text-xs font-bold text-[#6B5E57] shadow-sm transition hover:border-brandRed hover:text-brandRed"
              >
                <Truck size={13} className="text-brandRed" />
                <span>Track Existing Order</span>
                <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Split Grid: Value Proposition + Live Interactive Merchant Mockup */}
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
              {/* Left Column: Merchant Hero Copy */}
              <div className="max-w-[650px]">
                <h1 className="text-[clamp(2.6rem,5.8vw,4.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[#191616]">
                  Take your shop online.
                  <br />
                  <span className="bg-gradient-to-r from-brandRed via-red-600 to-amber-600 bg-clip-text text-transparent">
                    Keep 100% of profit.
                  </span>
                </h1>

                <p className="mt-6 text-base leading-relaxed text-[#5A504B] sm:text-lg">
                  Join SeroFast for a one-time ₹50 setup. Stop losing 20-30% of
                  your sales to traditional food and commerce delivery apps.
                  Our Central Campus Warehouse handles packing, student runner
                  dispatch in under 30 minutes, and instant automated UPI
                  settlements.
                </p>

                {/* Main Action Buttons */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Link
                    to="/signup"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-brandRed px-8 text-sm font-extrabold text-white shadow-xl shadow-brandRed/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brandRedDark hover:shadow-brandRed/35 cursor-pointer"
                  >
                    <Store size={18} />
                    <span>Create Your Store for ₹50</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href="#calculator"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-[#DCD0C7] bg-white/90 px-6 text-sm font-bold text-[#191616] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brandRed hover:text-brandRed"
                  >
                    <Percent size={17} className="text-brandRed" />
                    <span>Calculate Your ROI Savings</span>
                  </a>
                </div>

                {/* 3 Core Trust Badges */}
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#E8DDD5] pt-6 sm:gap-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A72]">
                      <Percent size={14} className="text-brandRed" />
                      <span>Commission</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      0% Forever
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A72]">
                      <Zap size={14} className="text-amber-500" />
                      <span>Campus Delivery</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      &lt; 30 Mins SLA
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8C7A72]">
                      <Wallet size={14} className="text-emerald-600" />
                      <span>Payout Rails</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      Instant UPI
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Tech Interactive Merchant Dashboard Live UI */}
              <div className="relative">
                {/* Ambient glow backing */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brandRed/20 via-amber-500/15 to-transparent blur-2xl" />

                {/* Dashboard Frame */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E0D5CC] bg-[#1E1B18] text-white shadow-2xl">
                  {/* Dashboard Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#161412] px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                        <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="ml-2 font-mono text-[11px] text-white/50">
                        serofast.merchant.engine://v2.8
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Hub Live
                      </span>
                    </div>
                  </div>

                  {/* Merchant Quick Metric Bar */}
                  <div className="grid grid-cols-3 border-b border-white/10 bg-white/5 p-4 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                        Today&apos;s Revenue
                      </span>
                      <p className="text-base font-black text-white sm:text-lg">
                        ₹8,490
                      </p>
                    </div>
                    <div className="border-x border-white/10">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                        Commission Paid
                      </span>
                      <p className="text-base font-black text-emerald-400 sm:text-lg">
                        ₹0 (100% Kept)
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-white/50">
                        Warehouse SLA
                      </span>
                      <p className="text-base font-black text-amber-300 sm:text-lg">
                        18 Mins Avg
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Nav Tabs */}
                  <div className="flex border-b border-white/10 bg-[#161412] px-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setDashboardTab("orders")}
                      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                        dashboardTab === "orders"
                          ? "border-brandRed text-white"
                          : "border-transparent text-white/50 hover:text-white/80"
                      }`}
                    >
                      <ShoppingBag size={13} />
                      <span>Live Order Stream</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardTab("payouts")}
                      className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition ${
                        dashboardTab === "payouts"
                          ? "border-brandRed text-white"
                          : "border-transparent text-white/50 hover:text-white/80"
                      }`}
                    >
                      <Wallet size={13} />
                      <span>Instant UPI Ledger</span>
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-4 sm:p-5">
                    {dashboardTab === "orders" ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-xs font-bold text-white/70">
                            Real-Time Campus Orders
                          </span>
                          <button
                            type="button"
                            onClick={handleSimulateOrder}
                            disabled={isSimulating}
                            className="inline-flex items-center gap-1 rounded-lg bg-brandRed/20 border border-brandRed/40 px-2.5 py-1 text-[11px] font-bold text-brandRed hover:bg-brandRed hover:text-white transition cursor-pointer"
                          >
                            <Plus size={12} />
                            <span>{isSimulating ? "Simulating..." : "Simulate New Order"}</span>
                          </button>
                        </div>

                        {/* Order Cards Stream */}
                        {simulatedOrders.map((order, idx) => (
                          <div
                            key={order.id + idx}
                            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-brandRed/40 hover:bg-white/10"
                          >
                            <div className="flex items-center gap-3">
                              <div className="grid h-9 w-9 place-items-center rounded-lg bg-brandRed/20 text-brandRed font-bold text-xs">
                                <Package size={16} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-white">
                                    {order.id}
                                  </span>
                                  <span className="text-[10px] text-white/50">
                                    • {order.time}
                                  </span>
                                </div>
                                <p className="text-xs text-white/80 font-medium">
                                  {order.item}
                                </p>
                                <p className="text-[10px] text-white/50">
                                  {order.customer}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-sm font-black text-white">
                                +₹{order.amount}
                              </span>
                              <div className="mt-0.5 flex items-center justify-end gap-1">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[10px] font-bold text-emerald-400">
                                  {order.status} ({order.eta})
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400">
                              Instant UPI Auto-Settlement Active
                            </span>
                            <CheckCircle2 size={16} className="text-emerald-400" />
                          </div>
                          <p className="mt-2 text-2xl font-black text-white">
                            ₹8,490.00
                          </p>
                          <p className="text-xs text-white/60">
                            100% credited to HDFC Bank A/C ending in **4920
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70 space-y-2">
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>SeroFast Platform Fee Deduction</span>
                            <span className="font-bold text-emerald-400">₹0.00 (0%)</span>
                          </div>
                          <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>Central Warehouse Dispatch & Packing</span>
                            <span className="font-bold text-white">Included</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Settlement Speed</span>
                            <span className="font-bold text-amber-300">Instant Real-Time</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dashboard Bottom Footer */}
                  <div className="flex items-center justify-between border-t border-white/10 bg-[#161412] px-5 py-3 text-xs">
                    <span className="text-white/60">
                      Ready to start receiving campus orders?
                    </span>
                    <Link
                      to="/signup"
                      className="inline-flex items-center gap-1 font-extrabold text-brandRed hover:underline"
                    >
                      <span>Activate for ₹50</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PLATFORM TRUST & METRICS MARQUEE
           ========================================================================= */}
        <section className="border-y border-[#EBE3DC] bg-[#FFFBF8] py-4 overflow-hidden">
          <div className="mx-auto flex w-[min(1320px,calc(100%_-_32px))] flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Percent size={16} className="text-brandRed" />
              <span>0% Commission (Merchants Keep 100%)</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E2D6CD] sm:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Coins size={16} className="text-amber-600" />
              <span>₹50 Nominal Lifetime Store Activation</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E2D6CD] sm:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Package size={16} className="text-emerald-600" />
              <span>Central Warehouse Automated Packing</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E2D6CD] md:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Zap size={16} className="text-blue-600" />
              <span>&lt; 30 Mins Student Runner Dispatch</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE 0% COMMISSION SAVINGS CALCULATOR
           ========================================================================= */}
        <section id="calculator" className="py-16 lg:py-24">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                <Percent size={14} />
                <span>Zero Commission Profit Engine</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                How Much Money Are You Losing to Traditional Aggregators?
              </h2>
              <p className="mt-3 text-base text-[#6B5E57]">
                Traditional marketplace & food apps drain your profits with
                18-30% commissions on every single order. Drag the slider below
                to calculate what you save with SeroFast.
              </p>
            </div>

            {/* Interactive Calculator Container */}
            <div className="mt-12 overflow-hidden rounded-3xl border border-[#E8DDD5] bg-white p-6 shadow-xl sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                {/* Left: Sliders */}
                <div>
                  <h3 className="text-xl font-extrabold text-[#191616]">
                    Set Your Monthly Sales Estimates
                  </h3>

                  {/* Revenue Slider */}
                  <div className="mt-6 rounded-2xl border border-[#E8DDD5] bg-[#FAF8F5] p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A72]">
                        Monthly Sales Volume
                      </span>
                      <span className="text-2xl font-black text-[#191616]">
                        ₹{monthlyRevenue.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="20000"
                      max="1000000"
                      step="10000"
                      value={monthlyRevenue}
                      onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                      className="mt-6 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-brandRed"
                    />

                    <div className="mt-3 flex justify-between text-[11px] font-bold text-[#8C7A72]">
                      <span>₹20,000 / mo</span>
                      <span>₹5,00,000 / mo</span>
                      <span>₹10,00,000 / mo</span>
                    </div>
                  </div>

                  {/* Commission Rate Slider */}
                  <div className="mt-4 rounded-2xl border border-[#E8DDD5] bg-[#FAF8F5] p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A72]">
                        Other Apps Commission Cut (%)
                      </span>
                      <span className="text-xl font-black text-rose-600">
                        {aggregatorCommissionRate}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="15"
                      max="30"
                      step="1"
                      value={aggregatorCommissionRate}
                      onChange={(e) =>
                        setAggregatorCommissionRate(Number(e.target.value))
                      }
                      className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600"
                    />

                    <div className="mt-2 flex justify-between text-[11px] font-bold text-[#8C7A72]">
                      <span>15% Low</span>
                      <span>22% Typical Food/Retail</span>
                      <span>30% High</span>
                    </div>
                  </div>
                </div>

                {/* Right: Comparative Results Card */}
                <div className="rounded-3xl border border-brandRed/20 bg-gradient-to-br from-[#FFF5F1] via-[#FFF0E8] to-[#FFEAE0] p-6 sm:p-8 shadow-inner">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-3 py-1 text-xs font-extrabold text-emerald-800">
                    <Sparkles size={13} />
                    <span>Your Annual Profit Retained</span>
                  </div>

                  <div className="mt-3">
                    <span className="text-4xl font-black text-[#191616] sm:text-5xl">
                      ₹{annualNetSavings.toLocaleString("en-IN")}
                    </span>
                    <span className="ml-2 text-xs font-extrabold text-emerald-700">
                      / Year Saved!
                    </span>
                  </div>

                  {/* Comparison Breakdown Rows */}
                  <div className="mt-6 space-y-3 border-t border-brandRed/15 pt-6 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-[#6B5E57]">
                      <span>Other Aggregator Annual Loss ({aggregatorCommissionRate}%):</span>
                      <span className="font-bold text-rose-600">
                        -₹{traditionalAnnualLost.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between font-bold text-[#191616]">
                      <span>SeroFast Platform Setup Cost:</span>
                      <span className="text-emerald-700">₹50 (One-Time Setup)</span>
                    </div>

                    <div className="flex items-center justify-between text-[#6B5E57]">
                      <span>Campus Central Warehouse Packing:</span>
                      <span className="font-semibold text-emerald-700">
                        100% Handled by SeroFast
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#6B5E57]">
                      <span>Payout Settlement:</span>
                      <span className="font-semibold text-[#191616]">
                        Instant Direct UPI
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/signup"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-brandRed py-4 text-sm font-extrabold text-white shadow-xl shadow-brandRed/25 transition hover:bg-brandRedDark"
                  >
                    <span>Register Your Store for ₹50</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. HOW IT WORKS: CENTRAL WAREHOUSE & STUDENT LOGISTICS ENGINE
           ========================================================================= */}
        <section id="fulfillment" className="border-y border-[#EBE3DC] bg-[#FFF8F4] py-16 lg:py-24">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800">
                <Cpu size={14} />
                <span>The SeroFast Fulfillment Architecture</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                How SeroFast Central Warehouse Works For You
              </h2>
              <p className="mt-3 text-base text-[#6B5E57]">
                We eliminated city traffic and expensive dark-stores by deploying
                hyperlocal campus micro-warehouses operated with verified
                student runners.
              </p>
            </div>

            {/* Interactive Step Switcher Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FULFILLMENT_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStepIndex === idx;
                return (
                  <div
                    key={step.step}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`cursor-pointer group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 ${
                      isActive
                        ? "border-brandRed bg-white shadow-xl -translate-y-1"
                        : "border-[#E8DDD5] bg-white/70 hover:bg-white hover:border-[#DCD0C7]"
                    }`}
                  >
                    <div>
                      {/* Step Number + Icon Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-2xl font-black text-brandRed">
                          {step.step}
                        </span>
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                            isActive
                              ? "bg-brandRed text-white"
                              : "bg-[#FAF8F5] text-[#6B5E57] group-hover:text-brandRed"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                      </div>

                      <span className="mt-4 inline-block text-[10px] font-extrabold uppercase tracking-wider text-brandRed">
                        {step.badge}
                      </span>
                      <h3 className="mt-1 text-base font-extrabold text-[#191616]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#6B5E57]">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#F0E8E1] pt-3 text-[11px] font-bold text-[#191616]">
                      <span className="text-[#8C7A72]">Benefit: </span>
                      <span className="text-emerald-700">{step.highlight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. VERIFIED CAMPUS MERCHANTS SHOWCASE
           ========================================================================= */}
        <section id="merchants" className="py-16 lg:py-24">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                  <Store size={13} />
                  <span>Campus Partner Stores</span>
                </div>
                <h2 className="mt-3 text-[clamp(1.8rem,3.8vw,2.8rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                  Thriving Merchants on SeroFast
                </h2>
                <p className="mt-2 max-w-[540px] text-sm text-[#6B5E57]">
                  From campus apparel brands to cafeterias and daily dorm needs,
                  merchants are keeping 100% of their profits.
                </p>
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-brandRed hover:underline"
              >
                <span>Join As A Partner Store</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Merchant Cards Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {VERIFIED_CAMPUS_MERCHANTS.map((m, idx) => (
                <div
                  key={idx}
                  className="group rounded-2xl border border-[#E8DDD5] bg-white p-5 shadow-sm transition hover:shadow-lg hover:border-brandRed/30"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <span className="rounded bg-brandRed/10 px-1.5 py-0.5 text-[9px] font-bold text-brandRed uppercase">
                        {m.badge}
                      </span>
                      <h3 className="mt-0.5 text-sm font-extrabold text-[#191616]">
                        {m.name}
                      </h3>
                      <p className="text-[10px] text-[#8C7A72]">{m.campus}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-[#F0E8E1] bg-[#FAF8F5] p-3 text-xs">
                    <div className="flex items-center justify-between text-[#6B5E57]">
                      <span>Monthly Volume:</span>
                      <span className="font-bold text-[#191616]">{m.sales}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between text-emerald-700 font-bold">
                      <span>Commission Saved:</span>
                      <span>{m.savedCommission}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#8C7A72]">
                    <span>★ {m.rating} Rating</span>
                    <span>{m.orders} Campus Orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. INVESTORS & STRATEGIC PARTNERS: HYPERLOCAL UNIT ECONOMICS
           ========================================================================= */}
        <section
          id="investors"
          className="border-y border-[#EBE3DC] bg-[#191616] py-16 text-white lg:py-24"
        >
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase text-amber-300">
                  <Building2 size={14} />
                  <span>Strategic Investor & Expansion Deep-Dive</span>
                </div>
                <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.4rem)] font-extrabold leading-tight tracking-[-0.03em] text-white">
                  Why Campus Micro-Fulfillment Is The Next Commerce Frontier.
                </h2>
                <p className="mt-3 max-w-[620px] text-base leading-relaxed text-white/70">
                  Quick commerce fails in general cities due to high CAC and
                  rider transit burn. SeroFast unlocks dense, captive university
                  ecosystems with near-zero last-mile overhead and unbeatable
                  merchant loyalty.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setTeaserOpen("Investor Data Room & Expansion Model")}
                  className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-6 py-3.5 text-xs font-extrabold text-white transition hover:bg-brandRedDark cursor-pointer"
                >
                  <span>Request Investor Deck</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {/* Investor 4-Pillars Bento Grid */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brandRed/20 text-brandRed font-bold text-sm">
                  01
                </div>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  Hyper-Dense Order Clusters
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Over 180 orders per sq km within university hostel wings
                  enables extreme batching efficiency impossible in regular
                  suburban neighborhoods.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-sm">
                  02
                </div>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  -62% Lower Last-Mile Cost
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Student runner dispatch completely bypasses traffic, fuel, and
                  vehicle maintenance costs, turning unit economics immediately
                  positive.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/20 text-amber-400 font-bold text-sm">
                  03
                </div>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  Zero Merchant Churn Moat
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  By offering 0% commission vs 20% on Zomato/Swiggy, SeroFast
                  locks in exclusive product catalogs and deep retail inventory.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/20 text-blue-400 font-bold text-sm">
                  04
                </div>
                <h3 className="mt-4 text-base font-extrabold text-white">
                  7-Day Campus Playbook
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  Standardized micro-hub software and merchant onboarding
                  allows rapid rollout to 500+ university campuses nationwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. MULTI-CATEGORY INTERACTIVE FAQ SECTION
           ========================================================================= */}
        <section id="faq" className="py-16 lg:py-24">
          <div className="mx-auto w-[min(960px,calc(100%_-_32px))]">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EFE8E2] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#6B5E57]">
                <HelpCircle size={14} />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-[#191616]">
                Everything You Need to Know
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="mt-8 flex justify-center gap-2">
              {["All", "Shop Owners", "Investors & Partners"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveFaqTab(cat);
                    setOpenFaqIndex(null);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                    activeFaqTab === cat
                      ? "bg-brandRed text-white shadow-md shadow-brandRed/20"
                      : "border border-[#E2D6CD] bg-white text-[#6B5E57] hover:border-brandRed"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion List */}
            <div className="mt-8 space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-2xl border border-[#E8DDD5] bg-white transition"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm font-extrabold text-[#191616] hover:text-brandRed cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#8C7A72]">
                          {faq.category}
                        </span>
                        {faq.question}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`text-[#8C7A72] transition-transform duration-300 ${
                          isOpen ? "rotate-90 text-brandRed" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-[#F0E8E1] bg-[#FFFBF8] p-5 text-xs sm:text-sm leading-relaxed text-[#6B5E57]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. FINAL CONVERSION BANNER
           ========================================================================= */}
        <section className="bg-gradient-to-r from-brandRed via-red-600 to-rose-700 py-16 text-white">
          <div className="mx-auto flex w-[min(1320px,calc(100%_-_32px))] flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-200">
                ₹50 One-Time Setup • 0% Commission
              </span>
              <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight">
                Launch Your Campus Store Today.
              </h2>
              <p className="mt-2 max-w-[540px] text-sm text-white/80">
                Join hundreds of local merchants scaling with SeroFast Central
                Campus Warehouse. Keep 100% of your retail margin profits.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 text-xs font-black text-brandRed shadow-2xl transition hover:bg-slate-100"
              >
                <Store size={18} />
                <span>Register Store for ₹50</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <span>Merchant Login</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Global Modals & Reusable Elements */}
      <Footer />
      <ScrollToTop />
      <MobileBottomNav />
      <AppTeaserModal
        isOpen={Boolean(teaserOpen)}
        onClose={() => setTeaserOpen(false)}
        initialItemName={typeof teaserOpen === "string" ? teaserOpen : "SeroFast Suite"}
      />
    </div>
  );
}
