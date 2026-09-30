import React from "react";
import { X } from "lucide-react";

export default function VideoStoryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-brandRed hover:text-white"
          aria-label="Close video"
        >
          <X size={18} />
        </button>
        <div className="p-6 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-brandRed">
            Serofast Story
          </span>
          <h3 className="mt-1 text-xl font-black text-[#191616]">
            How College Students in Kanyakumari are Building India's Commerce
          </h3>
        </div>
        <div className="relative aspect-video w-full bg-slate-100">
          <iframe
            className="h-full w-full"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="Serofast Story"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
