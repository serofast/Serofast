import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Footer,
  Header,
  MobileBottomNav,
  ScrollToTop,
  AppTeaserModal,
  ScrollReveal,
  FaqAccordion,
} from "./reusable";
import {
  HeroSection,
  MarqueeStrip,
  MobileAppShowcase,
  AppFeaturesBento,
  DualModeExperience,
  DownloadAppSection,
  VideoStoryModal,
} from "./home";

export default function HomePage() {
  const [teaserOpen, setTeaserOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  return (
    <div className="home-page min-h-screen bg-white text-[#191616] antialiased selection:bg-brandRed selection:text-white">
      {/* Toast Notification (Clean Light styled - No Green) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-[#191616] shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-brandRed shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Video Story Modal */}
      <VideoStoryModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* Navigation Header with Glossy Morphism */}
      <Header
        onOpenAppTeaser={(item) => setTeaserOpen(item || "SeroFast Mobile App")}
      />

      <main className="space-y-0">
        {/* 1. Hero Section (Reverted: Banner, Polaroids, Our Story Video) */}
        <HeroSection onOpenVideo={() => setVideoModalOpen(true)} />

        {/* 2. Marquee Content Strip (Smooth horizontal infinite glide) */}
        <MarqueeStrip />

        {/* 3. Mobile App Showcase (Synchronized Scroll: Phone rises from bottom & Core Commerce slides from right) */}
        <MobileAppShowcase onShowToast={showToast} />

        {/* 4. Core App Capabilities Bento Grid (Seamless transition & flip cards) */}
        <AppFeaturesBento />

        {/* 5. For Students / Dual Mode Experience (Side-by-side, no green) */}
        <DualModeExperience />

        {/* 6. Frequently Asked Questions */}
        <FaqAccordion />

        {/* 7. Download App Flagship Banner */}
        <DownloadAppSection
          onOpenTeaser={(item) => setTeaserOpen(item || "App Download")}
        />
      </main>

      <Footer />
      <ScrollToTop />
      <MobileBottomNav />
      <AppTeaserModal
        isOpen={Boolean(teaserOpen)}
        onClose={() => setTeaserOpen(false)}
        initialItemName={
          typeof teaserOpen === "string" ? teaserOpen : "SeroFast Mobile App"
        }
      />
    </div>
  );
}
