import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Coins,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Package,
  Percent,
  QrCode,
  Rocket,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Footer,
  Header,
  MobileBottomNav,
  ScrollToTop,
  ScrollReveal,
  AppTeaserModal,
} from "./reusable";

/* =========================================================
   LIVE HERO ORDER STREAM (simulated platform activity)
   ========================================================= */
const INITIAL_ORDERS = [
  {
    id: "SF-9481",
    item: "Exam Kit — Pens, Scale, Highlighters",
    customer: "via @aarav.shop",
    amount: 249,
    time: "Just now",
  },
  {
    id: "SF-9480",
    item: "Study Kit — Sticky Notes & Gel Pens",
    customer: "via @priya.store",
    amount: 189,
    time: "2 mins ago",
  },
  {
    id: "SF-9479",
    item: "Basic Student Kit — Pencil Set",
    customer: "via @rohan.sells",
    amount: 129,
    time: "5 mins ago",
  },
];

const SIM_ITEMS = [
  { name: "Geometry Box + Drawing Kit", price: 299 },
  { name: "College Notebook Bundle (5)", price: 349 },
  { name: "Exam Kit — Graph Sheets & Pens", price: 199 },
  { name: "Colour Pens + Highlighter Pack", price: 159 },
];

const SIM_SELLERS = ["@aarav.shop", "@priya.store", "@rohan.sells", "@meera.kits"];

/* =========================================================
   HOW IT WORKS STEPS
   ========================================================= */
const STEPS = [
  {
    step: "01",
    title: "Create Your Shop",
    description:
      "Register free and launch your reseller shop through a simple guided wizard. No stock, no upfront investment.",
    icon: Store,
    badge: "Takes 3 Minutes",
    highlight: "₹0 Setup Cost",
  },
  {
    step: "02",
    title: "Pick From Central Catalogue",
    description:
      "SeroFast sources and stocks the products. Browse the live catalogue, choose what your network loves, and set your margin.",
    icon: Package,
    badge: "Zero Inventory Risk",
    highlight: "Ready-Made Catalogue",
  },
  {
    step: "03",
    title: "Share & Sell Anywhere",
    description:
      "Share your shop link on WhatsApp, Instagram and campus networks. Customers order directly — SeroFast tracks every sale.",
    icon: Share2Icon,
    badge: "Your Network, Your Profit",
    highlight: "Live Order Alerts",
  },
  {
    step: "04",
    title: "We Pack, Deliver & Pay You",
    description:
      "SeroFast handles packing, delivery and customer support. Your earnings land in your dashboard — withdraw anytime.",
    icon: Wallet,
    badge: "Fully Managed Backend",
    highlight: "Transparent Payouts",
  },
];

/* Small inline icon helper so lucide imports stay clean */
function Share2Icon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/* =========================================================
   PLATFORM FEATURES (BENTO)
   ========================================================= */
const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Seller Dashboard",
    desc: "Live orders, inventory sync, earnings ledger and customer analytics in one clean console.",
    span: "lg:col-span-2",
    accent: "bg-brandRed/10 text-brandRed",
  },
  {
    icon: Truck,
    title: "Managed Delivery",
    desc: "Packing, dispatch and doorstep delivery handled by SeroFast.",
    span: "",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: QrCode,
    title: "Real-Time Order Tracking",
    desc: "Customers track every order live with a simple order ID.",
    span: "",
    accent: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Admin Controlled Catalogue",
    desc: "Platform admins curate products, pricing and stock from a central hub so sellers always sell what's available.",
    span: "lg:col-span-2",
    accent: "bg-amber-50 text-amber-700",
  },
];

/* =========================================================
   FAQ
   ========================================================= */
const FAQS = [
  {
    question: "What is SeroFast?",
    answer:
      "SeroFast is a student-powered commerce platform. We source and stock products, manage packing, delivery and payments — while student sellers share their shop with their network and earn a margin on every order.",
  },
  {
    question: "How do I start selling on SeroFast?",
    answer:
      "Create a free account, complete the guided shop setup wizard, and pick products from the central catalogue. There is no inventory to buy and no setup fee — you can start sharing your shop link within minutes.",
  },
  {
    question: "Do I need to buy stock or deliver orders?",
    answer:
      "No. SeroFast owns and manages the inventory, packing, delivery and customer support. You focus purely on selling to your network — your dashboard shows live order status and your earnings automatically.",
  },
  {
    question: "How do customers track their orders?",
    answer:
      "Every order gets a unique order ID. Customers can use the Track Order page on this site to see real-time delivery status — no app download or account needed.",
  },
];

/* =========================================================
   ANIMATED COUNTER HOOK
   ========================================================= */
function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* Marquee strip items */
const MARQUEE_ITEMS = [
  { icon: Percent, text: "0% Commission on Sellers" },
  { icon: Package, text: "Central Inventory — Zero Stock Risk" },
  { icon: Truck, text: "Packing & Delivery Managed" },
  { icon: Wallet, text: "Transparent Payouts" },
  { icon: QrCode, text: "Real-Time Order Tracking" },
  { icon: GraduationCap, text: "Built for Student Entrepreneurs" },
];

export default function HomePage() {
  const [teaserOpen, setTeaserOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [newOrderFlash, setNewOrderFlash] = useState(false);

  // Auto-cycle how-it-works steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  // Live order stream simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const item = SIM_ITEMS[Math.floor(Math.random() * SIM_ITEMS.length)];
      const seller = SIM_SELLERS[Math.floor(Math.random() * SIM_SELLERS.length)];
      const id = `SF-${Math.floor(9500 + Math.random() * 499)}`;

      setNewOrderFlash(true);
      setOrders((prev) =>
        [
          {
            id,
            item: item.name,
            customer: `via ${seller}`,
            amount: item.price,
            time: "Just now",
          },
          ...prev.slice(0, 3),
        ]
      );
      setTimeout(() => setNewOrderFlash(false), 900);
    }, 5200);
    return () => clearInterval(timer);
  }, []);

  const heroOrders = useCountUp(12480);
  const heroSellers = useCountUp(320);

  return (
    <div className="home-page min-h-screen bg-white text-[#191616] antialiased selection:bg-brandRed selection:text-white">
      <Header
        onOpenAppTeaser={(item) => setTeaserOpen(item || "SeroFast Suite")}
        hideFreeBuffBranding
      />

      <main>
        {/* =====================================================
            1. HERO — WHAT SEROFAST IS (DUAL AUDIENCE)
           ===================================================== */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-[#EBE3DC] bg-white pt-10 pb-20 lg:pt-16 lg:pb-28"
        >
          {/* Ambient brand glows */}
          <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-brandRed/[0.06] blur-[150px]" />
          <div className="pointer-events-none absolute -right-32 top-10 h-[550px] w-[550px] rounded-full bg-brandRed/[0.04] blur-[160px]" />

          <div className="relative mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={600}>
              <div className="mb-8 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-brandRed/20 bg-white/95 px-4 py-2 text-xs font-extrabold text-brandRed shadow-sm backdrop-blur-md transition-transform hover:scale-[1.02]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brandRed opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brandRed" />
                  </span>
                  <span>Student-Powered Commerce Platform</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#4f4a4a] shadow-sm">
                  <Sparkles size={13} className="text-brandRed" />
                  <span>Sellers earn. SeroFast runs the backend.</span>
                </div>
              </div>
            </ScrollReveal>

            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
              {/* ── Left: value proposition ── */}
              <ScrollReveal
                variant="fade-right"
                duration={700}
                delay={80}
                className="max-w-[640px]"
              >
                <h1 className="text-[clamp(2.6rem,5.6vw,4.6rem)] font-extrabold leading-[1.03] tracking-[-0.04em] text-[#191616]">
                  Sell to your network.
                  <br />
                  <span className="bg-gradient-to-r from-brandRed via-brandRedDark to-brandRed bg-clip-text text-transparent">
                    We handle the rest.
                  </span>
                </h1>

                <p className="mt-6 text-base leading-relaxed text-[#4f4a4a] sm:text-lg">
                  SeroFast gives every seller a ready-made online shop with a
                  central product catalogue. We source, stock, pack and deliver —
                  you share your link, bring orders, and keep your margin on
                  every sale.
                </p>

                {/* Primary actions */}
                <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                  <Link
                    to="/signup"
                    className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-brandRed px-8 text-sm font-extrabold text-white shadow-xl shadow-brandRed/25 transition-all duration-300 hover:-translate-y-1 hover:bg-brandRedDark hover:shadow-brandRed/40 cursor-pointer"
                  >
                    <Rocket size={18} />
                    <span>Start Selling Free</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {/* Live platform stats */}
                <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#EBE3DC] pt-6 sm:gap-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <ShoppingBag size={14} className="text-brandRed" />
                      <span>Orders Processed</span>
                    </div>
                    <span className="mt-1 text-lg font-black tabular-nums text-[#191616] sm:text-xl">
                      {heroOrders.toLocaleString("en-IN")}+
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <Users size={14} className="text-brandRed" />
                      <span>Active Sellers</span>
                    </div>
                    <span className="mt-1 text-lg font-black tabular-nums text-[#191616] sm:text-xl">
                      {heroSellers}+
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#8b8282]">
                      <Coins size={14} className="text-emerald-700" />
                      <span>Seller Margin</span>
                    </div>
                    <span className="mt-1 text-lg font-black text-[#191616] sm:text-xl">
                      100% Yours
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Right: visual story card ── */}
              <ScrollReveal
                variant="scale-up"
                duration={750}
                delay={150}
                className="relative mx-auto w-full max-w-[560px]"
              >
                <div className="overflow-hidden rounded-[30px] border border-[#E5E7EB] bg-white shadow-[0_30px_90px_rgba(25,22,22,0.14)]">
                  <div className="relative h-[520px] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                      alt="Students collaborating and learning marketing together"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#191616]/80 via-[#191616]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Student sellers building brands
                      </div>

                      <h3 className="max-w-[300px] text-2xl font-extrabold leading-tight tracking-[-0.04em]">
                        Learn marketing, grow income, and build your own shop.
                      </h3>

                      <div className="mt-5 flex items-center gap-3 text-sm text-white/80">
                        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold">
                          Campus creators
                        </div>
                        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-semibold">
                          Digital selling
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            2. TRUST MARQUEE STRIP
           ===================================================== */}
        <section className="overflow-hidden border-b border-[#EBE3DC] bg-white py-4">
          <div className="pause-on-hover animate-marquee">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center gap-10 pr-10"
                aria-hidden={copy === 1}
              >
                {MARQUEE_ITEMS.map(({ icon: Icon, text }) => (
                  <div
                    key={`${copy}-${text}`}
                    className="flex items-center gap-2 whitespace-nowrap text-xs font-extrabold text-[#191616]"
                  >
                    <Icon size={15} className="text-brandRed" />
                    <span>{text}</span>
                    <span className="ml-6 h-1.5 w-1.5 rounded-full bg-brandRed/30" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* =====================================================
            3. TWO WAYS TO USE SEROFAST (SELLER / ADMIN)
           ===================================================== */}
        <section
          id="audience"
          className="border-b border-[#EBE3DC] bg-white py-16 lg:py-24"
        >
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal
              variant="fade-down"
              duration={700}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                <Users size={14} />
                <span>One Platform, Two Power Roles</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                Built for Sellers &amp; Platform Admins
              </h2>
              <p className="mt-3 text-base text-[#4f4a4a]">
                Sellers run their own shop and earn from every order. Admins
                control the catalogue, stock and operations from a central hub.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {/* ── Seller card ── */}
              <ScrollReveal variant="fade-up" duration={700} delay={100} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#EBE3DC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/30 hover:shadow-xl sm:p-9 bento-glow-card">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandRed/[0.05] blur-3xl transition-opacity duration-500 group-hover:opacity-150" />

                  <div className="flex items-center gap-3.5">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brandRed text-white shadow-lg shadow-brandRed/25 transition-transform duration-300 group-hover:scale-110">
                      <Store size={22} />
                    </div>
                    <div>
                      <span className="rounded-md bg-brandRed/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brandRed">
                        For Sellers &amp; Students
                      </span>
                      <h3 className="mt-1 text-xl font-extrabold text-[#191616]">
                        Sell Without Buying Stock
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#4f4a4a]">
                    Turn your campus network into income. Your shop, your link,
                    your margin — SeroFast powers everything behind it.
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-[#EBE3DC] pt-5">
                    {[
                      "Free shop setup through a guided wizard",
                      "Ready-made catalogue — no inventory to buy",
                      "Orders land in your dashboard in real time",
                      "Packing, delivery & support fully handled",
                      "Track and withdraw earnings anytime",
                    ].map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-[13px] font-medium text-[#444]"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-brandRed transition-transform duration-200 group-hover:scale-110"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <Link
                      to="/signup"
                      className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-brandRed text-[13px] font-bold text-white shadow-lg shadow-brandRed/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brandRedDark active:scale-[0.98]"
                    >
                      <span>Become a Seller</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* ── Admin card ── */}
              <ScrollReveal variant="fade-up" duration={700} delay={220} className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#EBE3DC] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/30 hover:shadow-xl sm:p-9 bento-glow-card">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandRed/[0.05] blur-3xl transition-opacity duration-500 group-hover:opacity-150" />

                  <div className="flex items-center gap-3.5">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brandRed text-white shadow-lg shadow-brandRed/25 transition-transform duration-300 group-hover:scale-110">
                      <ClipboardList size={22} />
                    </div>
                    <div>
                      <span className="rounded-md bg-brandRed/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brandRed">
                        For Platform Admins
                      </span>
                      <h3 className="mt-1 text-xl font-extrabold text-[#191616]">
                        Control the Central Hub
                      </h3>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#4f4a4a]">
                    Admins run the engine: curate products, manage stock, monitor
                    orders and process seller payouts across the platform.
                  </p>

                  <ul className="mt-5 space-y-2.5 border-t border-[#EBE3DC] pt-5">
                    {[
                      "Central product catalogue & pricing control",
                      "Platform-wide order pipeline monitoring",
                      "Seller verification & shop approvals",
                      "Payout processing & earnings ledger",
                      "Real-time platform analytics",
                    ].map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-[13px] font-medium text-[#444]"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-brandRed transition-transform duration-200 group-hover:scale-110"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <Link
                      to="/login"
                      className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-brandRed/30 bg-white text-[13px] font-bold text-brandRed transition-all duration-300 hover:-translate-y-0.5 hover:bg-brandRed hover:text-white hover:shadow-lg hover:shadow-brandRed/25 active:scale-[0.98]"
                    >
                      <span>Admin Login</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* =====================================================
            4. HOW IT WORKS (AUTO-CYCLING INTERACTIVE STEPS)
           ===================================================== */}
        <section
          id="how-it-works"
          className="border-b border-[#EBE3DC] bg-white py-16 lg:py-24"
        >
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal
              variant="fade-down"
              duration={700}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                <Zap size={14} />
                <span>From Signup To First Sale</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                How SeroFast Works
              </h2>
              <p className="mt-3 text-base text-[#4f4a4a]">
                Four simple steps between you and your first order.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, idx) => {
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
                      className={`group h-full cursor-pointer relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 bento-glow-card ${
                        isActive
                          ? "border-brandRed bg-white shadow-xl -translate-y-1.5"
                          : "border-[#E5E7EB] bg-white hover:border-[#DCD0C7] hover:-translate-y-1"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-2xl font-black text-brandRed">
                            {step.step}
                          </span>
                          <div
                            className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                              isActive
                                ? "bg-brandRed text-white"
                                : "bg-white text-[#4f4a4a] group-hover:text-brandRed"
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

            {/* Step CTA */}
            <ScrollReveal variant="fade-up" delay={200} className="mt-10 text-center">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-brandRed px-7 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-brandRed/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brandRedDark hover:shadow-brandRed/40"
              >
                <Rocket size={16} />
                <span>Start With Step 1 — It's Free</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* =====================================================
            5. PLATFORM FEATURES BENTO
           ===================================================== */}
        <section
          id="features"
          className="border-b border-[#EBE3DC] bg-white py-16 lg:py-24"
        >
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal
              variant="fade-down"
              duration={700}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-1.5 rounded-full bg-brandRed/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-brandRed">
                <BarChart3 size={14} />
                <span>Everything In One Platform</span>
              </div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight tracking-[-0.03em] text-[#191616]">
                Serious Tools, Zero Learning Curve
              </h2>
            </ScrollReveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <ScrollReveal
                    key={feature.title}
                    variant="scale-up"
                    delay={idx * 110}
                    duration={650}
                    className={`h-full ${feature.span}`}
                  >
                    <div className="group h-full rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brandRed/40 hover:shadow-lg bento-glow-card">
                      <div
                        className={`grid h-11 w-11 place-items-center rounded-xl ${feature.accent} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon size={20} />
                      </div>
                      <h3 className="mt-4 text-base font-extrabold text-[#191616] group-hover:text-brandRed">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#4f4a4a] sm:text-[13px]">
                        {feature.desc}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            6. FAQ
           ===================================================== */}
        <section id="faq" className="border-b border-[#EBE3DC] bg-white py-16 lg:py-24">
          <div className="mx-auto w-[min(880px,calc(100%_-_32px))]">
            <ScrollReveal variant="fade-down" duration={600} className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#4f4a4a]">
                <HelpCircle size={14} className="text-brandRed" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="mt-3 text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-[#191616]">
                Everything You Need to Know
              </h2>
            </ScrollReveal>

            <div className="mt-10 space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <ScrollReveal
                    key={idx}
                    variant="fade-up"
                    delay={idx * 80}
                    duration={600}
                  >
                    <div
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? "border-brandRed/30 bg-white shadow-md"
                          : "border-[#E5E7EB] bg-white hover:border-brandRed/20"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-sm font-extrabold text-[#191616] hover:text-brandRed"
                        aria-expanded={isOpen}
                      >
                        <span>{faq.question}</span>
                        <ChevronRight
                          size={18}
                          className={`shrink-0 text-[#8b8282] transition-transform duration-300 ${
                            isOpen ? "rotate-90 text-brandRed" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="border-t border-[#EBE3DC] px-5 pb-5 pt-4 text-[13px] leading-relaxed text-[#4f4a4a]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            7. FINAL CONVERSION BANNER
           ===================================================== */}
        <section className="overflow-hidden bg-gradient-to-r from-brandRed via-brandRedDark to-brandRed py-16 text-white">
          <div className="mx-auto w-[min(1320px,calc(100%_-_32px))]">
            <ScrollReveal variant="scale-up" duration={750}>
              <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
                <div>
                  <span className="rounded-full bg-white/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider">
                    Free Setup • 0% Commission • Full Backend Support
                  </span>
                  <h2 className="mt-3 text-[clamp(2rem,4vw,3.1rem)] font-black leading-tight">
                    Your Shop Is One Click Away.
                  </h2>
                  <p className="mt-2 max-w-[560px] text-sm text-white/90">
                    Join the sellers growing with SeroFast. Create your shop,
                    share your link, and let us handle everything else.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/signup"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-white px-8 text-xs font-black text-brandRed shadow-2xl transition hover:scale-105 hover:bg-slate-100"
                  >
                    <Store size={18} />
                    <span>Create Your Shop</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-6 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                  >
                    <span>Login</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

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
