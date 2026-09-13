import React, { useState, useEffect } from 'react';

interface AnnouncementBarProps {
  onOpenEarlyLaunch?: () => void;
}

const ANNOUNCEMENTS = [
  'DISCOVER THE NEW ELORA COLLECTION · EARLY ACCESS NOW OPEN',
  'COMPLIMENTARY NATIONWIDE COURIER ON ALL FLACON COMMISSIONS',
  'INAUGURAL BATCH 001 · MACERATED & HAND-NUMBERED IN STRICT RESERVE',
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenEarlyLaunch }) => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <aside
      id="announcement-bar"
      aria-label="Atelier announcements"
      className="bg-[#120F0D] text-warm-ivory border-b border-[#2C241E] py-2.5 px-4 relative z-40 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <button
          type="button"
          onClick={onOpenEarlyLaunch}
          className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-sans font-medium text-warm-ivory/90 hover:text-antique-gold transition-colors focus:outline-none"
          title="Commission Genesis Allocation"
        >
          <span className="inline-block transition-opacity duration-500 ease-in-out">
            {ANNOUNCEMENTS[currentIdx]}
          </span>
        </button>
      </div>
    </aside>
  );
};
