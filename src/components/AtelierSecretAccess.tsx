import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Shield, Lock } from 'lucide-react';

/**
 * Secret Owner Quick-Access Trigger:
 * 1. Global Keyboard Shortcut: Pressing [Ctrl + Shift + A] or [Cmd + Shift + A] redirects to /admin/login.
 * 2. Hidden UI Element: A discreet, low-opacity monogram seal positioned at the lower-right edge of the viewport.
 *    Hovering reveals the gold Atelier Crest; clicking navigates directly to the secured /admin/login gate.
 */
export const AtelierSecretAccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Do not show trigger if already inside the /admin portal
  const isInsideAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Ctrl + Shift + A OR Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigate('/admin/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (isInsideAdmin) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-30 hidden sm:block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => navigate('/admin/login')}
        type="button"
        title="Owner Atelier Console (Shortcut: Ctrl+Shift+A)"
        aria-label="Atelier Owner Access"
        className={`group flex items-center space-x-2 px-2.5 py-1.5 rounded-full border transition-all duration-300 focus:outline-none ${
          isHovered
            ? 'bg-[#14141B]/95 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] opacity-100 scale-105'
            : 'bg-[#14141B]/40 border-[#3A3948]/40 opacity-25 hover:opacity-100'
        }`}
      >
        <div className="w-5 h-5 rounded-full bg-[#1C1B24] flex items-center justify-center text-[#D4AF37] group-hover:rotate-12 transition-transform">
          <KeyRound className="w-2.5 h-2.5 stroke-[1.75]" />
        </div>

        {isHovered && (
          <span className="font-serif text-[10px] tracking-[0.2em] uppercase text-[#FAF9F6] pr-1 animate-fadeIn">
            Atelier Portal
          </span>
        )}
      </button>
    </div>
  );
};
