/** biome-ignore-all lint/a11y/noSvgWithoutTitle: _ */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
/** biome-ignore-all lint/a11y/useButtonType: _ */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { saveGlucose } from "@/db/actions/save-glucose";
import { useSession } from "@/lib/auth-client";

const formSchema = z.object({
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Hora é obrigatória"),
  glucose: z
    .string()
    .min(1, "Medição de glicemia é obrigatória")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: "Valor deve ser um número positivo",
    })
    .refine((val) => Number(val) <= 600, {
      message: "Valor muito alto. Verifique a medição",
    }),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterGlucosePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Pegar data e hora atual
  const now = new Date();
  const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const session = useSession();

  if (!session) redirect("/");

  const { data: sessionData } = session;

  if (!sessionData) redirect("/");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: currentDate,
      time: currentTime,
      glucose: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const dateTime = new Date(`${data.date}T${data.time}`);

      await saveGlucose({
        userId: sessionData.user.id,
        timestamp: dateTime,
        glicemia: Number(data.glucose),
      });

      setSuccessMessage("Pressão arterial registrada com sucesso!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGlucoseStatus = (value: string) => {
    const glucose = Number(value);
    if (!glucose || Number.isNaN(glucose)) return null;

    if (glucose < 70)
      return {
        text: "Baixa",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
      };
    if (glucose >= 70 && glucose <= 140)
      return { text: "Normal", color: "text-green-400", bg: "bg-green-500/10" };
    if (glucose > 140 && glucose <= 180)
      return {
        text: "Atenção",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
      };
    return { text: "Alta", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const glucoseValue = form.watch("glucose");
  const status = getGlucoseStatus(glucoseValue);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated blood cells background */}
      <div className="absolute inset-0 opacity-15">
        {[
          { delay: "0s", duration: "9s", x: "8%", y: "18%" },
          { delay: "2s", duration: "13s", x: "78%", y: "62%" },
          { delay: "4s", duration: "11s", x: "22%", y: "82%" },
          { delay: "1s", duration: "15s", x: "88%", y: "28%" },
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
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-red-900/30 flex items-center justify-center hover:bg-zinc-800/60 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold text-white">
                Registrar Glicemia
              </h1>
              <p className="text-zinc-400 text-sm">
                Adicione sua medição de glicose
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-8">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-red-900/30 rounded-2xl p-6 shadow-2xl animate-slide-up">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Date and Time Row */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-100 text-sm font-medium">
                          Data
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-zinc-950/50 border-red-900/40 text-white focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-12"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-red-100 text-sm font-medium">
                          Hora
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-zinc-950/50 border-red-900/40 text-white focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-12"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Glucose Measurement */}
                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-red-100 text-sm font-medium">
                        Glicemia (mg/dL)
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Ex: 98"
                            className="bg-zinc-950/50 border-red-900/40 text-white placeholder:text-zinc-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 transition-all duration-300 h-14 text-2xl font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            disabled={isLoading}
                            {...field}
                          />
                          {status && (
                            <div
                              className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg ${status.bg} animate-fade-in`}
                            >
                              <span
                                className={`text-xs font-semibold ${status.color}`}
                              >
                                {status.text}
                              </span>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Reference ranges info */}
                <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-4">
                  <p className="text-zinc-400 text-xs font-medium mb-2">
                    Valores de referência:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">
                        Hipoglicemia
                      </span>
                      <span className="text-yellow-400 text-xs font-semibold">
                        &lt; 70 mg/dL
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">Normal</span>
                      <span className="text-green-400 text-xs font-semibold">
                        70 - 140 mg/dL
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">Atenção</span>
                      <span className="text-orange-400 text-xs font-semibold">
                        140 - 180 mg/dL
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">
                        Hiperglicemia
                      </span>
                      <span className="text-red-400 text-xs font-semibold">
                        &gt; 180 mg/dL
                      </span>
                    </div>
                  </div>
                </div>

                {successMessage && (
                  <div className="bg-green-950/50 border border-green-800/50 rounded-lg p-3 animate-fade-in">
                    <p className="text-green-200 text-sm text-center font-medium">
                      {successMessage}
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    "Registrar Medição"
                  )}
                </Button>
              </form>
            </Form>
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
