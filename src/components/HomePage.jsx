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
  Quote,
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
  ScrollReveal,
  AppTeaserModal,
} from "./reusable";

// Sample live simulated campus stores running on SeroFast Central Hub with strict brand palette
const VERIFIED_CAMPUS_MERCHANTS = [
  {
    id: "m-1",
    name: "Urban Threads Apparel",
    category: "Apparel & Drops",
    campus: "North Campus Central Hub",
    sales: "₹1,84,000 / mo",
    savedCommission: "₹40,480 saved",
    rating: "4.9",
    orders: 412,
    avatar: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80",
    badge: "Streetwear & Hoodies",
    sla: "22 Mins SLA",
    quote: "We scaled our hoodie drops from 20 to 400 orders a month without giving away 22% cuts.",
    owner: "Karan S., Co-Founder",
  },
  {
    id: "m-2",
    name: "The Campus Grill & Cafe",
    category: "Food & Cafes",
    campus: "Food Court Annex",
    sales: "₹2,65,000 / mo",
    savedCommission: "₹58,300 saved",
    rating: "4.9",
    orders: 890,
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80",
    badge: "Gourmet Snacks & Shakes",
    sla: "18 Mins SLA",
    quote: "Instant UPI payouts mean zero cash-flow delay. Student runners deliver directly to rooms.",
    owner: "Ananya R., Head Chef",
  },
  {
    id: "m-3",
    name: "Nexus Tech & Stationery",
    category: "Tech & Gadgets",
    campus: "Library Block Hub",
    sales: "₹1,15,000 / mo",
    savedCommission: "₹25,300 saved",
    rating: "4.8",
    orders: 320,
    avatar: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80",
    badge: "Gadgets & Supplies",
    sla: "25 Mins SLA",
    quote: "Stocking our inventory in the campus central hub completely solved hostel delivery.",
    owner: "Vikram P., Store Lead",
  },
  {
    id: "m-4",
    name: "Aura Skincare & Grooming",
    category: "Dorm Essentials",
    campus: "South Campus Wing",
    sales: "₹92,000 / mo",
    savedCommission: "₹20,240 saved",
    rating: "5.0",
    orders: 195,
    avatar: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&auto=format&fit=crop&q=80",
    badge: "Hostel Essentials",
    sla: "20 Mins SLA",
    quote: "With 0% commission, we can offer students genuine retail pricing while growing profit.",
    owner: "Sneha M., Founder",
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

  // Partner Store category filter state
  const [activeMerchantCategory, setActiveMerchantCategory] = useState("All");

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
    const hostels = [
      "Hostel 1, Room 108",
      "Hostel 5, Wing C",
      "PG Tower Block A",
      "Hostel 2, Room 304",
    ];
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
    }, 450);
  };

  const filteredMerchants = useMemo(() => {
    if (activeMerchantCategory === "All") return VERIFIED_CAMPUS_MERCHANTS;
    return VERIFIED_CAMPUS_MERCHANTS.filter(
      (m) => m.category === activeMerchantCategory
    );
  }, [activeMerchantCategory]);

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
            1. HERO SECTION: HARMONIOUS BRAND COLOR SYSTEM
           ========================================================================= */}
        <section className="relative overflow-hidden border-b border-[#EBE3DC] bg-gradient-to-b from-[#FFF5F2] via-[#FAF8F5] to-[#FAF8F5] pt-8 pb-20 lg:pt-14 lg:pb-28">
          {/* Subtle Ambient Radial Lighting in Brand Red Tones */}
          <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-brandRed/[0.06] blur-[150px]" />
          <div className="pointer-events-none absolute -right-32 top-10 h-[550px] w-[550px] rounded-full bg-brandRed/[0.04] blur-[160px]" />

          <div className="relative mx-auto w-[min(1320px,calc(100%_-_32px))]">
            {/* Top Badge Row */}
            <ScrollReveal variant="fade-down" duration={600}>
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-brandRed/20 bg-white/95 px-4 py-2 text-xs font-extrabold text-brandRed shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandRed opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brandRed"></span>
                  </span>
                  <span>0% Commission Merchant Commerce Engine</span>
                  <span className="hidden sm:inline-block text-[#8b8282]">•</span>
                  <span className="hidden sm:inline-block text-[#4f4a4a] font-bold">
                    ₹50 One-Time Setup
                  </span>
                </div>

                {/* Live Campus Hub Status Indicator */}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#4f4a4a] shadow-sm">
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <span>Campus Central Warehouse: Live Dispatch</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Split Grid: Hero Copy + Floating Console Showcase */}
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
              {/* Left Column: Hero Value Proposition */}
              <ScrollReveal variant="fade-right" duration={700} delay={80} className="max-w-[660px]">
                <h1 className="text-[clamp(2.7rem,6vw,4.9rem)] font-extrabold leading-[1.01] tracking-[-0.04em] text-[#191616]">
                  Digitize your shop.
                  <br />
                  <span className="bg-gradient-to-r from-brandRed via-brandRedDark to-brandRed bg-clip-text text-transparent">
                    Keep 100% of profit.
                  </span>
                </h1>

                <p className="mt-6 text-base leading-relaxed text-[#4f4a4a] sm:text-lg">
                  Stop losing 20-30% on food & commerce aggregator apps. List your
                  store on SeroFast for a one-time ₹50 setup. Our Central Campus
                  Warehouse handles packing, student runner dispatch in under 30
                  minutes, and instant automated UPI bank settlements.
                </p>

                {/* Main Action Buttons */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Link
                    to="/signup"
                    className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-brandRed px-8 text-sm font-extrabold text-white shadow-xl shadow-brandRed/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brandRedDark hover:shadow-brandRed/40 cursor-pointer"
                  >
                    <Store size={18} />
                    <span>Register Store for ₹50</span>
                    <ArrowRight size={16} />
                  </Link>

                  <a
                    href="#calculator"
                    className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white/90 px-6 text-sm font-bold text-[#191616] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brandRed hover:text-brandRed"
                  >
                    <Percent size={17} className="text-brandRed" />
                    <span>Calculate Your ROI Savings</span>
                  </a>
                </div>

                {/* 3 Core Trust Badges */}
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#EBE3DC] pt-6 sm:gap-6">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <Percent size={14} className="text-brandRed" />
                      <span>Commission</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      0% Forever
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <Zap size={14} className="text-brandRed" />
                      <span>Campus Delivery</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      &lt; 30 Mins SLA
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <Wallet size={14} className="text-emerald-700" />
                      <span>Payout Rails</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      Instant UPI
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Column: High-Tech Interactive Merchant Dashboard Console + Floating Chips */}
              <ScrollReveal variant="scale-up" duration={750} delay={150} className="relative">
                {/* Floating Chip 1: Instant UPI Payout (Top Left) */}
                <div className="animate-float-slow absolute -top-5 -left-4 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-white/95 px-3.5 py-2.5 text-xs font-extrabold text-[#191616] shadow-xl backdrop-blur-md">
                  <div className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#191616]">
                      +₹1,249 UPI Settled
                    </p>
                    <p className="text-[9px] text-emerald-700 font-extrabold">
                      0% Platform Deductions
                    </p>
                  </div>
                </div>

                {/* Floating Chip 2: Runner Dispatch (Bottom Right) */}
                <div className="animate-float-reverse absolute -bottom-5 -right-4 z-20 hidden sm:flex items-center gap-2.5 rounded-2xl border border-brandRed/20 bg-white/95 px-3.5 py-2.5 text-xs font-extrabold text-[#191616] shadow-xl backdrop-blur-md">
                  <div className="grid h-7 w-7 place-items-center rounded-xl bg-brandRed/10 text-brandRed">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#191616]">
                      Central Hub Dispatched
                    </p>
                    <p className="text-[9px] text-[#8b8282]">
                      Runner assigned • ETA 14m
                    </p>
                  </div>
                </div>

                {/* Ambient glow backing */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-brandRed/15 via-brandRed/5 to-transparent blur-2xl" />

                {/* Dashboard Console Frame */}
                <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#191616] text-white shadow-2xl transition-all duration-300">
                  {/* Dashboard Header Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#121010] px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-brandRed" />
                        <span className="h-3 w-3 rounded-full bg-white/20" />
                        <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      </div>
                      <span className="ml-2 font-mono text-[11px] text-white/50">
                        serofast.merchant.engine://v2.8
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Central Hub Live
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
                      <p className="text-base font-black text-brandRed sm:text-lg">
                        18 Mins Avg
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Nav Tabs */}
                  <div className="flex border-b border-white/10 bg-[#121010] px-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setDashboardTab("orders")}
                      className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        dashboardTab === "orders"
                          ? "border-brandRed text-white bg-white/5 rounded-t-lg"
                          : "border-transparent text-white/50 hover:text-white/80"
                      }`}
                    >
                      <ShoppingBag size={13} />
                      <span>Live Order Stream</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardTab("payouts")}
                      className={`flex items-center gap-1.5 border-b-2 px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                        dashboardTab === "payouts"
                          ? "border-brandRed text-white bg-white/5 rounded-t-lg"
                          : "border-transparent text-white/50 hover:text-white/80"
                      }`}
                    >
                      <Wallet size={13} />
                      <span>Instant UPI Ledger</span>
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-4 sm:p-5 min-h-[260px]">
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
                            className="inline-flex items-center gap-1.5 rounded-lg bg-brandRed px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-brandRed/30 hover:bg-brandRedDark transition-all duration-200 cursor-pointer active:scale-95"
                          >
                            <Plus size={13} />
                            <span>{isSimulating ? "Dispatching..." : "Simulate New Order"}</span>
                          </button>
                        </div>

                        {/* Order Cards Stream */}
                        {simulatedOrders.map((order, idx) => (
                          <div
                            key={order.id + idx}
                            className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-300 hover:border-brandRed/40 hover:bg-white/10 hover:translate-x-1"
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
                            100% credited to registered merchant bank A/C
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
                            <span className="font-bold text-emerald-400">Instant Real-Time</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dashboard Bottom Footer */}
                  <div className="flex items-center justify-between border-t border-white/10 bg-[#121010] px-5 py-3 text-xs">
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
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. PLATFORM TRUST & METRICS MARQUEE
           ========================================================================= */}
        <section className="border-y border-[#EBE3DC] bg-[#FAF8F5] py-4 overflow-hidden">
          <div className="mx-auto flex w-[min(1320px,calc(100%_-_32px))] flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Percent size={16} className="text-brandRed" />
              <span>0% Commission (Merchants Keep 100%)</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E5E7EB] sm:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Coins size={16} className="text-brandRed" />
              <span>₹50 Nominal Lifetime Store Activation</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E5E7EB] sm:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Package size={16} className="text-emerald-700" />
              <span>Central Warehouse Automated Packing</span>
            </div>
            <div className="hidden h-4 w-px bg-[#E5E7EB] md:block" />
            <div className="flex items-center gap-2 text-xs font-black text-[#191616]">
              <Zap size={16} className="text-brandRed" />
              <span>&lt; 30 Mins Student Runner Dispatch</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. INTERACTIVE 0% COMMISSION ROI & PROFIT SIMULATOR (BRAND COLOR THEME)
           ========================================================================= */}
        <section id="calculator" className="relative py-16 lg:py-24 overflow-hidden bg-white border-b border-[#EBE3DC]">
          <div className="relative mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={700} className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed shadow-sm">
                <Percent size={14} />
                <span>Interactive Merchant ROI Simulator</span>
              </div>
              <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,3.3rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                Calculate Exact Profits Kept with 0% Commission
              </h2>
              <p className="mt-3 text-base text-[#4f4a4a] max-w-2xl mx-auto">
                Compare SeroFast&apos;s ₹50 activation against traditional 18-30% food and retail aggregators. Select your estimated monthly volume or pick a quick preset.
              </p>

              {/* Quick Volume Presets */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  { label: "₹50K Kiosk", val: 50000 },
                  { label: "₹1.5L Campus Cafe", val: 150000 },
                  { label: "₹3.5L Apparel Drop", val: 350000 },
                  { label: "₹7.5L High Volume", val: 750000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setMonthlyRevenue(preset.val)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      monthlyRevenue === preset.val
                        ? "bg-brandRed text-white shadow-md shadow-brandRed/20 scale-105"
                        : "bg-[#FAF8F5] border border-[#E5E7EB] text-[#4f4a4a] hover:border-brandRed hover:text-brandRed"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Interactive Calculator Bento Grid */}
            <ScrollReveal variant="scale-up" duration={750} delay={150}>
              <div className="mt-10 overflow-hidden rounded-3xl border border-[#EBE3DC] bg-[#FAF8F5] p-6 shadow-xl sm:p-10 lg:p-12 bento-glow-card">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                  {/* Left Column: Sliders & Live Comparison Bar Graph */}
                  <div>
                    <h3 className="text-xl font-extrabold text-[#191616]">
                      Adjust Monthly Estimates
                    </h3>

                    {/* Revenue Slider */}
                    <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8b8282]">
                          Estimated Monthly Sales
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
                        className="mt-6 h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-[#E5E7EB] accent-brandRed"
                      />

                      <div className="mt-3 flex justify-between text-[11px] font-bold text-[#8b8282]">
                        <span>₹20,000 / mo</span>
                        <span>₹5,00,000 / mo</span>
                        <span>₹10,00,000 / mo</span>
                      </div>
                    </div>

                    {/* Commission Rate Slider */}
                    <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#8b8282]">
                          Aggregator Commission Cut (%)
                        </span>
                        <span className="text-xl font-black text-brandRed">
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
                        className="mt-5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E5E7EB] accent-brandRed"
                      />

                      <div className="mt-2 flex justify-between text-[11px] font-bold text-[#8b8282]">
                        <span>15% Low</span>
                        <span>22% Typical Retail/Food</span>
                        <span>30% High</span>
                      </div>
                    </div>

                    {/* Live Visual Comparison Fill Bars */}
                    <div className="mt-6 space-y-3 rounded-2xl border border-[#E5E7EB] bg-white p-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold pb-1">
                          <span className="text-[#4f4a4a]">Other Apps Cut ({aggregatorCommissionRate}%):</span>
                          <span className="text-brandRed">-₹{traditionalCommissionLostMonthly.toLocaleString("en-IN")}/mo lost</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
                          <div
                            className="h-full bg-brandRed rounded-full transition-all duration-500"
                            style={{ width: `${aggregatorCommissionRate * 3}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold pb-1">
                          <span className="text-[#191616]">SeroFast Retained (100%):</span>
                          <span className="text-emerald-700 font-extrabold">+₹{monthlyRevenue.toLocaleString("en-IN")}/mo kept!</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: "100%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Comparative Results Card + Reinvestment Impact */}
                  <div className="rounded-3xl border border-brandRed/20 bg-white p-6 sm:p-8 shadow-md">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-800">
                      <Sparkles size={13} className="text-emerald-700" />
                      <span>Projected Annual Savings</span>
                    </div>

                    <div className="mt-3">
                      <span className="text-4xl font-black text-[#191616] sm:text-5xl">
                        ₹{annualNetSavings.toLocaleString("en-IN")}
                      </span>
                      <span className="ml-2 text-xs font-extrabold text-emerald-700">
                        / Year Kept!
                      </span>
                    </div>

                    {/* Comparison Breakdown Rows */}
                    <div className="mt-6 space-y-3 border-t border-[#EBE3DC] pt-6 text-xs sm:text-sm">
                      <div className="flex items-center justify-between text-[#4f4a4a]">
                        <span>Other Aggregator Annual Cut ({aggregatorCommissionRate}%):</span>
                        <span className="font-bold text-brandRed">
                          -₹{traditionalAnnualLost.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between font-bold text-[#191616]">
                        <span>SeroFast Platform Setup Cost:</span>
                        <span className="text-emerald-700">₹50 (One-Time Setup)</span>
                      </div>

                      <div className="flex items-center justify-between text-[#4f4a4a]">
                        <span>Campus Central Warehouse Packing:</span>
                        <span className="font-semibold text-emerald-700">
                          100% Handled by SeroFast
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#4f4a4a]">
                        <span>Payout Settlement:</span>
                        <span className="font-semibold text-[#191616]">
                          Instant Direct UPI
                        </span>
                      </div>
                    </div>

                    {/* What this saved money means */}
                    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-xs text-[#4f4a4a] space-y-1.5">
                      <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-700" />
                        <span>Reinvestment Power for Your Store:</span>
                      </p>
                      <p className="text-[11px]">
                        • Reinvest in ~{Math.max(1, Math.floor(annualNetSavings / 1500))} extra product SKUs
                      </p>
                      <p className="text-[11px]">
                        • 100% zero debt or recurring platform cuts
                      </p>
                    </div>

                    <Link
                      to="/signup"
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brandRed py-4 text-sm font-extrabold text-white shadow-xl shadow-brandRed/25 transition-all hover:bg-brandRedDark hover:scale-[1.01]"
                    >
                      <span>Register Your Store for ₹50</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* =========================================================================
            4. HOW IT WORKS: CENTRAL WAREHOUSE & LOGISTICS (CASCADE STAGGERED REVEAL)
           ========================================================================= */}
        <section id="fulfillment" className="border-b border-[#EBE3DC] bg-[#FAF8F5] py-16 lg:py-24">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={700} className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                <Cpu size={14} />
                <span>The SeroFast Fulfillment Architecture</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                How SeroFast Central Warehouse Works For You
              </h2>
              <p className="mt-3 text-base text-[#4f4a4a]">
                We eliminated city traffic and expensive dark-stores by deploying
                hyperlocal campus micro-warehouses operated with verified
                student runners.
              </p>
            </ScrollReveal>

            {/* Interactive Step Switcher Grid with Staggered Entrance */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FULFILLMENT_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStepIndex === idx;
                return (
                  <ScrollReveal
                    key={step.step}
                    variant="fade-up"
                    delay={idx * 130}
                    duration={700}
                    className="h-full"
                  >
                    <div
                      onClick={() => setActiveStepIndex(idx)}
                      className={`h-full cursor-pointer group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 bento-glow-card ${
                        isActive
                          ? "border-brandRed bg-white shadow-xl -translate-y-1.5"
                          : "border-[#E5E7EB] bg-white hover:border-[#DCD0C7] hover:-translate-y-1"
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
                                : "bg-[#FAF8F5] text-[#4f4a4a] group-hover:text-brandRed"
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
                        <p className="mt-2 text-xs leading-relaxed text-[#4f4a4a]">
                          {step.description}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-[#EBE3DC] pt-3 text-[11px] font-bold text-[#191616]">
                        <span className="text-[#8b8282]">Benefit: </span>
                        <span className="text-emerald-700">{step.highlight}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. REDESIGNED VERIFIED CAMPUS PARTNER STORES SHOWCASE
           ========================================================================= */}
        <section id="merchants" className="py-16 lg:py-24 relative overflow-hidden bg-white border-b border-[#EBE3DC]">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={600} className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                  <Store size={13} />
                  <span>Campus Partner Stores</span>
                </div>
                <h2 className="mt-3 text-[clamp(1.9rem,3.8vw,2.9rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                  Thriving Merchants on SeroFast
                </h2>
                <p className="mt-2 max-w-[540px] text-sm text-[#4f4a4a]">
                  From campus apparel brands to cafeterias and daily dorm needs,
                  merchants are keeping 100% of their retail margins.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {["All", "Apparel & Drops", "Food & Cafes", "Tech & Gadgets", "Dorm Essentials"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveMerchantCategory(cat)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      activeMerchantCategory === cat
                        ? "bg-brandRed text-white shadow-md shadow-brandRed/20 scale-105"
                        : "bg-[#FAF8F5] border border-[#E5E7EB] text-[#4f4a4a] hover:border-brandRed hover:text-brandRed"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Merchant Cards Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMerchants.map((m, idx) => (
                <ScrollReveal
                  key={m.id}
                  variant="scale-up"
                  delay={idx * 120}
                  duration={650}
                  className="h-full"
                >
                  <div className="h-full group flex flex-col justify-between rounded-3xl border border-[#E5E7EB] bg-[#FAF8F5] p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brandRed/40 hover:-translate-y-2 bento-glow-card">
                    <div>
                      {/* Top Header Row with Avatar & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="h-13 w-13 rounded-2xl object-cover border border-[#E5E7EB] shadow-sm transition-transform duration-300 group-hover:scale-105"
                          />
                          <div>
                            <span className="rounded-md bg-brandRed/10 px-2 py-0.5 text-[9px] font-extrabold text-brandRed uppercase tracking-wider">
                              {m.badge}
                            </span>
                            <h3 className="mt-1 text-sm font-extrabold text-[#191616] group-hover:text-brandRed transition-colors">
                              {m.name}
                            </h3>
                            <p className="text-[10px] text-[#8b8282] flex items-center gap-1">
                              <MapPin size={10} className="text-brandRed" /> {m.campus}
                            </p>
                          </div>
                        </div>

                        <span className="flex h-2 w-2 relative shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                        </span>
                      </div>

                      {/* Financial Metrics Summary Pill */}
                      <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[#4f4a4a]">
                          <span>Monthly Sales:</span>
                          <span className="font-extrabold text-[#191616]">{m.sales}</span>
                        </div>
                        <div className="flex items-center justify-between text-emerald-700 font-bold">
                          <span>0% Commission Gain:</span>
                          <span>{m.savedCommission}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#8b8282] text-[10px]">
                          <span>Fulfillment SLA:</span>
                          <span className="font-semibold text-brandRed">{m.sla}</span>
                        </div>
                      </div>

                      {/* Testimonial Quote Snippet */}
                      <div className="mt-4 border-t border-[#EBE3DC] pt-3 text-[11px] text-[#4f4a4a] italic leading-relaxed">
                        &ldquo;{m.quote}&rdquo;
                        <p className="not-italic text-[10px] font-bold text-[#8b8282] mt-1 text-right">
                          — {m.owner}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="mt-5 border-t border-[#EBE3DC] pt-3 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-[#8b8282]">
                        ★ {m.rating} ({m.orders} orders)
                      </span>
                      <button
                        type="button"
                        onClick={() => setTeaserOpen(`${m.name} Storefront Demo`)}
                        className="inline-flex items-center gap-1 font-extrabold text-brandRed hover:underline cursor-pointer text-[11px]"
                      >
                        <span>Demo Store</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Bottom Merchant Banner */}
            <ScrollReveal variant="fade-up" delay={200} duration={600} className="mt-12 rounded-2xl border border-[#EBE3DC] bg-[#FAF8F5] p-5 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brandRed/10 text-brandRed font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#191616]">
                    48+ Campus Stores Connected across 3 University Hubs
                  </p>
                  <p className="text-[11px] text-[#8b8282]">
                    Average merchant retention rate: 99.2% with ₹0 recurring platform cuts
                  </p>
                </div>
              </div>

              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-brandRedDark shrink-0"
              >
                <Store size={14} />
                <span>Join As A Partner Store</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* =========================================================================
            6. INVESTORS & STRATEGIC PARTNERS: HYPERLOCAL UNIT ECONOMICS (BENTO FLY-IN)
           ========================================================================= */}
        <section
          id="investors"
          className="border-b border-[#EBE3DC] bg-[#191616] py-16 text-white lg:py-24"
        >
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={700} className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase text-white">
                  <Building2 size={14} className="text-brandRed" />
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
                  className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-6 py-3.5 text-xs font-extrabold text-white transition hover:bg-brandRedDark cursor-pointer shadow-lg shadow-brandRed/20"
                >
                  <span>Request Investor Deck</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </ScrollReveal>

            {/* Investor 4-Pillars Bento Grid with Staggered Cascading Reveal */}
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  num: "01",
                  title: "Hyper-Dense Order Clusters",
                  desc: "Over 180 orders per sq km within university hostel wings enables extreme batching efficiency impossible in regular suburban neighborhoods.",
                  color: "text-brandRed bg-brandRed/20",
                },
                {
                  num: "02",
                  title: "-62% Lower Last-Mile Cost",
                  desc: "Student runner dispatch completely bypasses traffic, fuel, and vehicle maintenance costs, turning unit economics immediately positive.",
                  color: "text-emerald-400 bg-emerald-500/20",
                },
                {
                  num: "03",
                  title: "Zero Merchant Churn Moat",
                  desc: "By offering 0% commission vs 20% on traditional aggregators, SeroFast locks in exclusive product catalogs and deep retail inventory.",
                  color: "text-brandRed bg-brandRed/20",
                },
                {
                  num: "04",
                  title: "7-Day Campus Playbook",
                  desc: "Standardized micro-hub software and merchant onboarding allows rapid rollout to 500+ university campuses nationwide.",
                  color: "text-white bg-white/20",
                },
              ].map((pillar, idx) => (
                <ScrollReveal
                  key={pillar.num}
                  variant="fade-up"
                  delay={idx * 140}
                  duration={750}
                  className="h-full"
                >
                  <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1.5">
                    <div className={`grid h-10 w-10 place-items-center rounded-xl font-bold text-sm ${pillar.color}`}>
                      {pillar.num}
                    </div>
                    <h3 className="mt-4 text-base font-extrabold text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/70">
                      {pillar.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. MULTI-CATEGORY INTERACTIVE FAQ SECTION (ACCORDION REVEAL)
           ========================================================================= */}
        <section id="faq" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#EBE3DC]">
          <div className="mx-auto w-[min(960px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={600} className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#4f4a4a]">
                <HelpCircle size={14} className="text-brandRed" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-[#191616]">
                Everything You Need to Know
              </h2>
            </ScrollReveal>

            {/* Filter Tabs */}
            <ScrollReveal variant="fade-up" delay={100} duration={600} className="mt-8 flex justify-center gap-2">
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
                      : "border border-[#E5E7EB] bg-white text-[#4f4a4a] hover:border-brandRed hover:text-brandRed"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </ScrollReveal>

            {/* Accordion List */}
            <div className="mt-8 space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <ScrollReveal
                    key={idx}
                    variant="fade-up"
                    delay={idx * 80}
                    duration={600}
                  >
                    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-all duration-300 hover:border-brandRed/30 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-5 text-left text-sm font-extrabold text-[#191616] hover:text-brandRed cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="rounded bg-[#FAF8F5] border border-[#E5E7EB] px-2 py-0.5 text-[10px] font-bold text-[#8b8282]">
                            {faq.category}
                          </span>
                          {faq.question}
                        </span>
                        <ChevronRight
                          size={18}
                          className={`text-[#8b8282] transition-transform duration-300 ${
                            isOpen ? "rotate-90 text-brandRed" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-[#EBE3DC] bg-[#FAF8F5] p-5 text-xs sm:text-sm leading-relaxed text-[#4f4a4a]">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. FINAL CONVERSION BANNER (SCALE REVEAL)
           ========================================================================= */}
        <section className="bg-gradient-to-r from-brandRed via-brandRedDark to-brandRed py-16 text-white overflow-hidden">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="scale-up" duration={750}>
              <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                <div>
                  <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white">
                    ₹50 One-Time Setup • 0% Commission
                  </span>
                  <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-black leading-tight">
                    Launch Your Campus Store Today.
                  </h2>
                  <p className="mt-2 max-w-[540px] text-sm text-white/90">
                    Join hundreds of local merchants scaling with SeroFast Central
                    Campus Warehouse. Keep 100% of your retail margin profits.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/signup"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 text-xs font-black text-brandRed shadow-2xl transition hover:bg-slate-100 hover:scale-105"
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
            </ScrollReveal>
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
