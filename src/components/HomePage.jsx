import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Footer,
  Header,
  MobileBottomNav,
  ScrollToTop,
  AppTeaserModal,
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
  const [selectedLocation, setSelectedLocation] = useState("Nagercoil");
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
      {/* Toast Notification (Clean Light styled) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-[#191616] shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Video Story Modal */}
      <VideoStoryModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* Navigation Header */}
      <Header
        onOpenAppTeaser={(item) => setTeaserOpen(item || "SeroFast Mobile App")}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
      />

      <main>
        {/* 1. Hero Section (Animated elements, live stats, floating polaroids) */}
        <HeroSection onOpenVideo={() => setVideoModalOpen(true)} />

        {/* 2. Marquee Content Strip (Smooth horizontal scrolling) */}
        <MarqueeStrip />

        {/* 3. Mobile App Showcase (Parallel scroll entrance & 3D tilt, interactive previews) */}
        <MobileAppShowcase onShowToast={showToast} />

        {/* 4. Core App Capabilities Bento Grid (Fade+slide reveals, hover lift) */}
        <AppFeaturesBento />

        {/* 5. Dual Modes in One App (Mode toggle switcher, animated checklist) */}
        <DualModeExperience />

        {/* 6. Download App Banner (Animated counters, glow pulse rings, micro-interactions) */}
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
