import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, X } from 'lucide-react';

export const CinemaSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleOpenWatchFilm = () => {
    setIsFullscreenModalOpen(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
      <section
        id="elora-cinema"
        aria-label="Elora Cinéma Campaign Film"
        className="py-24 sm:py-36 bg-[#0A0A0C] text-[#FAF9F6] border-t border-b border-[#24232C] relative overflow-hidden"
      >
        {/* Ambient Dark Atmospheric Backlight */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-r from-[#945827]/15 via-[#D4AF37]/10 to-transparent blur-3xl opacity-70" />
        </div>

        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT: CINEMA PREVIEW FRAME (Large aspect ratio with luxury letterboxing) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative aspect-[16/9] rounded-2xl bg-[#080706] overflow-hidden border border-[#D4AF37]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] group">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover opacity-85 transition-opacity duration-700 group-hover:opacity-95"
                >
                  <source
                    src="https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/Fashion_Film_with_top_model_Daniela_Botero.webm/Fashion_Film_with_top_model_Daniela_Botero.webm.480p.vp9.webm"
                    type="video/webm"
                  />
                </video>

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C]/90 via-transparent to-[#0A0A0C]/40 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 flex items-center space-x-2 text-[9px] uppercase tracking-[0.28em] font-sans text-[#D4AF37]">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>ELORA CINÉMA · 4K DCI</span>
                </div>

                {/* Center Play Overlay on hover or when paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
                    aria-label="Play film"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#0A0A0C] flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                      <Play className="w-6 h-6 ml-1 fill-[#0A0A0C]" />
                    </div>
                  </button>
                )}

                {/* Minimal Luxury Line Controls */}
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between z-20">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-8 h-8 rounded bg-[#14141B]/90 backdrop-blur-md border border-[#262633] text-[#FAF9F6] hover:text-[#D4AF37] transition-colors flex items-center justify-center"
                      aria-label={isPlaying ? 'Pause film' : 'Play film'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="w-8 h-8 rounded bg-[#14141B]/90 backdrop-blur-md border border-[#262633] text-[#FAF9F6] hover:text-[#D4AF37] transition-colors flex items-center justify-center"
                      aria-label={isMuted ? 'Unmute film' : 'Mute film'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <span className="text-[9.5px] uppercase tracking-[0.2em] font-sans text-[#A1A1AA]">
                    GRASSE · BARCELONA · 02:45
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: EDITORIAL SCRIPT & [ WATCH FILM ] CTA */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-7 lg:pl-4 text-center lg:text-left">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#D4AF37] font-sans font-medium">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>AUTEUR CAMPAIGN FILM</span>
                </div>

                <h2 className="font-serif text-fluid-h1 tracking-[0.06em] text-[#FFFFFF] uppercase font-normal leading-[1.08]">
                  ELORA CINÉMA
                </h2>

                <p className="font-serif italic text-xl sm:text-2xl text-[#D4AF37] tracking-[0.04em]">
                  A Story in Every Drop.
                </p>
              </div>

              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto lg:mx-0" />

              <p className="text-sm sm:text-base text-[#D4D4D8] font-sans leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
                An unhurried visual study of tactile presence, nightfall shadows, and botanical distillation. Shot on 35mm film across the jasmine fields of Grasse and the sunlit stone villas of the Mediterranean.
              </p>

              {/* [ WATCH FILM ] CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenWatchFilm}
                  id="watch-film-cta"
                  className="group w-full sm:w-auto px-10 py-4 bg-[#D4AF37] text-[#0A0A0C] hover:bg-[#E5C378] text-xs uppercase tracking-[0.26em] font-sans transition-all duration-300 shadow-[0_6px_24px_rgba(212,175,55,0.25)] font-semibold inline-flex items-center justify-center space-x-3"
                >
                  <Play className="w-3.5 h-3.5 fill-[#0A0A0C]" />
                  <span>WATCH FILM</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      {isFullscreenModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-[16/9] bg-black border border-[#C5A880]/50 shadow-2xl rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsFullscreenModalOpen(false)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 text-white hover:text-[#D4B382] transition-colors"
              aria-label="Close film"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              autoPlay
              controls
              playsInline
              className="w-full h-full object-cover"
            >
              <source
                src="https://upload.wikimedia.org/wikipedia/commons/transcoded/8/8a/Fashion_Film_with_top_model_Daniela_Botero.webm/Fashion_Film_with_top_model_Daniela_Botero.webm.480p.vp9.webm"
                type="video/webm"
              />
            </video>
          </div>
        </div>
      )}
    </>
  );
};
