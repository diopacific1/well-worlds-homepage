import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, ZoomIn, X } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackIconSize?: number;
  fallbackText?: string;
  enableZoom?: boolean;
  priority?: boolean;
}

export default function ImageWithFallback({ 
  src, 
  alt = "이미지", 
  className = "", 
  containerClassName = "",
  fallbackIconSize = 28,
  fallbackText = "이미지를 불러올 수 없습니다",
  enableZoom = true,
  priority = false,
  ...props 
}: ImageWithFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close lightbox with ESC key
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const hasValidSrc = Boolean(src && typeof src === "string" && src.trim() !== "");

  return (
    <>
      <div 
        className={`group/img relative overflow-hidden bg-surface-container-lowest select-none ${containerClassName} ${
          enableZoom && hasValidSrc && !hasError ? "cursor-zoom-in" : ""
        }`}
        onClick={() => {
          if (enableZoom && hasValidSrc && !hasError) {
            setIsLightboxOpen(true);
          }
        }}
      >
        {/* Shimmer loading skeleton */}
        <AnimatePresence>
          {!isLoaded && !hasError && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-0 bg-gradient-to-r from-surface-dim/30 via-surface-variant/40 to-surface-dim/30 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Modern styled fallback */}
        {hasError || !hasValidSrc ? (
          <div className="absolute inset-0 z-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-surface-dim/40 to-surface-variant/20 border border-outline/10">
            <div className="w-12 h-12 rounded-2xl bg-surface/60 backdrop-blur-md flex items-center justify-center text-on-surface-variant/50 shadow-inner mb-2 border border-outline/10">
              <ImageIcon size={fallbackIconSize} className="opacity-60" />
            </div>
            <span className="text-xs text-on-surface-variant/70 font-medium tracking-tight">
              {fallbackText}
            </span>
          </div>
        ) : (
          <>
            <img
              src={src}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-700 ease-out z-10 relative ${
                isLoaded 
                  ? "opacity-100 scale-100 blur-0" 
                  : "opacity-0 scale-[1.03] blur-[4px]"
              } ${className}`}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              {...props}
            />

            {/* Subtle inner specular border & hover zoom indicator */}
            <div className="absolute inset-0 z-20 pointer-events-none rounded-[inherit] ring-1 ring-inset ring-black/5" />

            {enableZoom && isLoaded && (
              <div className="absolute bottom-3 right-3 z-30 opacity-0 group-hover/img:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/img:translate-y-0 pointer-events-none">
                <div className="px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 shadow-lg border border-white/15">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>확대보기</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modern Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && hasValidSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} 크게 보기`}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              aria-label="닫기"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/15 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Image Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-surface/5 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl select-none"
              />
              {alt && alt !== "이미지" && (
                <div className="p-3 text-center bg-black/40 backdrop-blur-md border-t border-white/10 text-white/90 text-sm font-medium">
                  {alt}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
