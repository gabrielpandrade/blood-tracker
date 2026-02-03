/** biome-ignore-all lint/a11y/noSvgWithoutTitle: _*/
/** biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
/** biome-ignore-all lint/a11y/useButtonType: _ */
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const user = useSession
    // Exemplo: const user = await getUser();
    setUserName("João"); 
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  const actions = [
    {
      id: "report",
      title: "Relatório",
      description: "Visualize seu histórico completo",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      gradient: "from-blue-500/20 to-blue-700/20",
      border: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500/60",
      shadow: "shadow-blue-500/20",
      hoverShadow: "hover:shadow-blue-500/40",
      iconColor: "text-blue-400",
      href: "/report",
    },
    {
      id: "glucose",
      title: "Registrar Glicemia",
      description: "Adicione uma nova medição",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
      gradient: "from-red-500/20 to-red-700/20",
      border: "border-red-500/30",
      hoverBorder: "hover:border-red-500/60",
      shadow: "shadow-red-500/20",
      hoverShadow: "hover:shadow-red-500/40",
      iconColor: "text-red-400",
      href: "/glucose/new",
    },
    {
      id: "pressure",
      title: "Registrar PA",
      description: "Registre pressão arterial",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      gradient: "from-pink-500/20 to-pink-700/20",
      border: "border-pink-500/30",
      hoverBorder: "hover:border-pink-500/60",
      shadow: "shadow-pink-500/20",
      hoverShadow: "hover:shadow-pink-500/40",
      iconColor: "text-pink-400",
      href: "/pressure/new",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated blood cells background */}
      <div className="absolute inset-0 opacity-15">
        {[
          { delay: "0s", duration: "10s", x: "5%", y: "15%" },
          { delay: "2s", duration: "14s", x: "80%", y: "65%" },
          { delay: "4s", duration: "12s", x: "20%", y: "85%" },
          { delay: "1s", duration: "16s", x: "92%", y: "25%" },
        ].map((cell, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-linear-to-br from-red-500/60 to-red-900/30 blur-3xl animate-float"
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
      <div className="absolute inset-0 bg-linear-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header with greeting */}
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-start justify-between mb-2">
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-white mb-1">
                {greeting},{" "}
                <span className="bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  {userName}
                </span>
              </h1>
              <p className="text-zinc-400 text-sm">Como está sua saúde hoje?</p>
            </div>

            {/* Profile icon */}
            <button
              onClick={() => router.push("/profile")}
              className="w-12 h-12 rounded-full bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>

          {/* Quick stats card */}
          <div className="mt-6 bg-zinc-900/60 backdrop-blur-xl border border-red-900/20 rounded-2xl p-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-xs font-medium mb-1">
                  Última medição
                </p>
                <p className="text-white text-lg font-semibold">Há 2 horas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="px-6 pb-8">
          <h2 className="text-zinc-300 text-sm font-semibold mb-4 uppercase tracking-wider">
            Ações Rápidas
          </h2>
          <div className="space-y-4">
            {actions.map((action, index) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className={`w-full bg-zinc-900/60 backdrop-blur-xl border ${action.border} ${action.hoverBorder} rounded-2xl p-6 shadow-lg ${action.shadow} ${action.hoverShadow} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group animate-slide-up`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  {/* Icon container */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-linear-to-br ${action.gradient} border ${action.border} flex items-center justify-center ${action.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {action.icon}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 text-left">
                    <h3 className="text-white text-lg font-semibold mb-1 group-hover:text-red-300 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow icon */}
                  <svg
                    className="w-6 h-6 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent activity section */}
        <div className="px-6 pb-12">
          <h2 className="text-zinc-300 text-sm font-semibold mb-4 uppercase tracking-wider">
            Atividade Recente
          </h2>
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  Glicemia - 98 mg/dL
                </p>
                <p className="text-zinc-500 text-xs">Hoje às 14:30</p>
              </div>
              <span className="text-green-400 text-xs font-semibold px-2 py-1 bg-green-500/10 rounded-lg">
                Normal
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  PA - 120/80 mmHg
                </p>
                <p className="text-zinc-500 text-xs">Hoje às 09:15</p>
              </div>
              <span className="text-blue-400 text-xs font-semibold px-2 py-1 bg-blue-500/10 rounded-lg">
                Normal
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(25px, -25px) scale(1.05);
          }
          66% {
            transform: translate(-15px, 15px) scale(0.95);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float var(--tw-animation-duration, 10s) ease-in-out
            infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
