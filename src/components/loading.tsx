/** biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
/** biome-ignore-all lint/a11y/noSvgWithoutTitle: _ */
import { cn } from "@/lib/utils";

interface LoadingProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  fullScreen = true, // Alterado para default true para facilitar o uso
  size = "md",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const pulseSize = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const LoadingContent = (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className="relative">
        {/* Pulse Rings */}
        <div
          className={cn(
            "absolute inset-0 -m-4 rounded-full bg-red-500/20 animate-ping",
            pulseSize[size]
          )}
          style={{ animationDuration: "2s" }}
        />
        
        {/* Heart Container */}
        <div
          className={cn(
            "relative rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl shadow-red-500/50",
            sizeClasses[size]
          )}
          style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
        >
          <svg
            className={cn(
              "text-white fill-current",
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"
            )}
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>

      {text && (
        <p className="text-red-200/80 text-sm font-medium animate-pulse tracking-wide">
          {text}
        </p>
      )}

      {/* Bounce Dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black">
        {/* Background "Blood Cells" */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { delay: "0s", duration: "8s", x: "15%", y: "20%" },
            { delay: "2s", duration: "12s", x: "75%", y: "65%" },
            { delay: "4s", duration: "10s", x: "35%", y: "75%" },
          ].map((cell, i) => (
            <div
              key={i}
              className="absolute w-32 h-32 rounded-full bg-red-900/20 blur-3xl"
              style={{
                left: cell.x,
                top: cell.y,
                animation: `float ${cell.duration} ease-in-out infinite`,
                animationDelay: cell.delay,
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10">{LoadingContent}</div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, -40px) scale(1.2); }
            66% { transform: translate(-30px, 20px) scale(0.8); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.4); }
            50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.7); }
          }
        `}</style>
      </div>
    );
  }

  return LoadingContent;
}