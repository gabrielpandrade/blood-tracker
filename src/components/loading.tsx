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
  fullScreen = false,
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
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      {/* Animated heart icon with pulse */}
      <div className="relative">
        {/* Outer pulse rings */}
        <div
          className={cn(
            "absolute inset-0 -m-4 rounded-full bg-red-500/20 animate-ping",
            pulseSize[size],
          )}
          style={{ animationDuration: "2s" }}
        />
        <div
          className={cn(
            "absolute inset-0 -m-2 rounded-full bg-red-500/10 animate-ping",
            pulseSize[size],
          )}
          style={{ animationDuration: "1.5s", animationDelay: "0.3s" }}
        />

        {/* Heart container */}
        <div
          className={cn(
            "relative rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center shadow-2xl shadow-red-500/50 animate-pulse-glow",
            sizeClasses[size],
          )}
        >
          <svg
            className={cn(
              "text-white",
              size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8",
            )}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p className="text-red-200/80 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}

      {/* Loading dots */}
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
        {/* Animated blood cells background */}
        <div className="absolute inset-0 opacity-20">
          {[
            { delay: "0s", duration: "8s", x: "10%", y: "20%" },
            { delay: "2s", duration: "12s", x: "70%", y: "60%" },
            { delay: "4s", duration: "10s", x: "30%", y: "80%" },
          ].map((cell, i) => (
            <div
              key={i}
              className="absolute w-16 h-16 rounded-full bg-linear-to-br from-red-500/80 to-red-900/40 blur-2xl animate-float"
              style={{
                animationDelay: cell.delay,
                animationDuration: cell.duration,
                left: cell.x,
                top: cell.y,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-red-950/20 via-transparent to-red-900/10 pointer-events-none" />

        {/* Loading content */}
        <div className="relative z-10">{LoadingContent}</div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -30px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }

          @keyframes pulse-glow {
            0%,
            100% {
              box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
            }
            50% {
              box-shadow: 0 0 40px rgba(220, 38, 38, 0.8);
            }
          }

          .animate-float {
            animation: float var(--tw-animation-duration, 10s) ease-in-out
              infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  return LoadingContent;
}
