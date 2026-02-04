/** biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, ChevronRight, Heart, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { fetchLatestGlucose } from "@/lib/api/glucose";
import type { Glucose } from "@/types/glucose";
import type { Pressure } from "@/types/pressure";

interface HomeClientProps {
  user: {
    name?: string | null;
  };
  initialLastGlucose?: Glucose | null;
  lastPressure?: Pressure;
}

export default function HomeClient({
  user,
  initialLastGlucose,
  lastPressure,
}: HomeClientProps) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  const { data: lastGlucose } = useQuery({
    queryKey: ["glucose", "latest"],
    queryFn: fetchLatestGlucose,
    initialData: initialLastGlucose ?? null,
    staleTime: 1000 * 30,
  });

  const actions = [
    {
      id: "report",
      title: "Relatório",
      description: "Visualize seu histórico completo",
      icon: BarChart3,
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
      icon: Plus,
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
      icon: Heart,
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

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="px-6 pt-12 pb-8">
          <h1 className="text-3xl font-bold text-white animate-fade-in">
            {greeting},{" "}
            <span className="bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              {user.name}
            </span>
          </h1>
        </div>

        {/* Action cards */}
        <div className="px-6 pb-8 space-y-4">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Card
                key={action.id}
                tabIndex={0}
                onClick={() => router.push(action.href)}
                className={`
                  cursor-pointer
                  bg-zinc-900/60 backdrop-blur-xl
                  border ${action.border} ${action.hoverBorder}
                  rounded-2xl
                  shadow-lg ${action.shadow} ${action.hoverShadow}
                  transition-all duration-300
                  hover:scale-[1.02]
                  active:scale-[0.98]
                  group
                  animate-slide-up
                `}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`
                      w-16 h-16 rounded-2xl
                      bg-linear-to-br ${action.gradient}
                      border ${action.border}
                      flex items-center justify-center
                      ${action.iconColor}
                      group-hover:scale-110
                      transition-transform duration-300
                    `}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="text-white text-lg font-semibold mb-1 group-hover:text-red-300 transition-colors duration-300">
                      {action.title}
                    </h3>
                    <p className="text-zinc-400 text-sm">
                      {action.description}
                    </p>
                  </div>

                  <ChevronRight className="w-6 h-6 text-zinc-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent activity */}
        <div className="px-6 pb-12">
          <Card className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl">
            <CardContent className="p-5">
              {lastGlucose ? (
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      lastGlucose.glucose > 140 ? "bg-red-500" : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      Glicemia – {lastGlucose.glucose} mg/dL
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {new Date(lastGlucose.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs mb-4">
                  Nenhum registro de glicemia encontrado.
                </p>
              )}

              {lastPressure ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      lastPressure.systolic >= 140 ||
                      lastPressure.diastolic >= 90
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      PA – {lastPressure.systolic}/{lastPressure.diastolic} mmHg
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {new Date(lastPressure.timestamp).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-500 text-xs">
                  Nenhum registro de PA encontrado.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Animations */}
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
          animation: float 10s ease-in-out infinite;
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
