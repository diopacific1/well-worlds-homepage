import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon } from "lucide-react";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fallbackIconSize?: number;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  containerClassName = "",
  fallbackIconSize = 32,
  ...props 
}: ImageWithFallbackProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-surface-container-lowest ${containerClassName}`}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-0 bg-surface-variant/30 animate-pulse"
          />
        )}
      </AnimatePresence>
      
      {hasError ? (
        <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-on-surface-variant">
          <ImageIcon size={fallbackIconSize} className="opacity-20 mb-2" />
          <span className="text-[10px] opacity-50 font-medium">Image Not Found</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-out z-10 relative ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      )}
    </div>
  );
}
