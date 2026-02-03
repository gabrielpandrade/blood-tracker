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
import { savePressure } from "@/db/actions/save-pressure";
import { useSession } from "@/lib/auth-client";

const formSchema = z
  .object({
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Hora é obrigatória"),
    systolic: z
      .string()
      .min(1, "Pressão sistólica é obrigatória")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Valor deve ser um número positivo",
      })
      .refine((val) => Number(val) <= 300, {
        message: "Valor muito alto. Verifique a medição",
      }),
    diastolic: z
      .string()
      .min(1, "Pressão diastólica é obrigatória")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
        message: "Valor deve ser um número positivo",
      })
      .refine((val) => Number(val) <= 200, {
        message: "Valor muito alto. Verifique a medição",
      }),
  })
  .refine((data) => Number(data.systolic) > Number(data.diastolic), {
    message: "Pressão sistólica deve ser maior que a diastólica",
    path: ["systolic"],
  });

type FormData = z.infer<typeof formSchema>;

export default function RegisterPressurePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const now = new Date();
  const currentDate = now.toISOString().split("T")[0];
  const currentTime = now.toTimeString().slice(0, 5);

  const session = useSession();

  if (!session) redirect("/");

  const { data: sessionData } = session;

  if (!sessionData) redirect("/");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: currentDate,
      time: currentTime,
      systolic: "",
      diastolic: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const dateTime = new Date(`${data.date}T${data.time}`);

      await savePressure({
        userId: sessionData.user.id,
        timestamp: dateTime,
        sistolica: Number(data.systolic),
        diastolica: Number(data.diastolic),
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

  const getPressureStatus = (systolic: string, diastolic: string) => {
    const sys = Number(systolic);
    const dia = Number(diastolic);

    if (!sys || !dia || Number.isNaN(sys) || Number.isNaN(dia)) return null;

    // Classificação segundo diretrizes
    if (sys < 120 && dia < 80)
      return { text: "Normal", color: "text-green-400", bg: "bg-green-500/10" };
    if (sys >= 120 && sys < 130 && dia < 80)
      return {
        text: "Elevada",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
      };
    if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90))
      return {
        text: "Hipertensão Estágio 1",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
      };
    if ((sys >= 140 && sys < 180) || (dia >= 90 && dia < 120))
      return {
        text: "Hipertensão Estágio 2",
        color: "text-red-400",
        bg: "bg-red-500/10",
      };
    if (sys >= 180 || dia >= 120)
      return {
        text: "Crise Hipertensiva",
        color: "text-red-500",
        bg: "bg-red-600/20",
      };

    return { text: "Normal", color: "text-green-400", bg: "bg-green-500/10" };
  };

  const systolicValue = form.watch("systolic");
  const diastolicValue = form.watch("diastolic");
  const status = getPressureStatus(systolicValue, diastolicValue);

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
            className="absolute w-20 h-20 rounded-full bg-linear-to-br from-pink-500/60 to-pink-900/30 blur-3xl animate-float"
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
      <div className="absolute inset-0 bg-linear-to-b from-pink-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-pink-900/30 flex items-center justify-center hover:bg-zinc-800/60 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5 text-pink-400"
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
              <h1 className="text-2xl font-bold text-white">Registrar PA</h1>
              <p className="text-zinc-400 text-sm">
                Adicione sua medição de pressão arterial
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-8">
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-pink-900/30 rounded-2xl p-6 shadow-2xl animate-slide-up">
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
                        <FormLabel className="text-pink-100 text-sm font-medium">
                          Data
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-zinc-950/50 border-pink-900/40 text-white focus-visible:border-pink-500 focus-visible:ring-pink-500/20 transition-all duration-300 h-12"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-pink-100 text-sm font-medium">
                          Hora
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-zinc-950/50 border-pink-900/40 text-white focus-visible:border-pink-500 focus-visible:ring-pink-500/20 transition-all duration-300 h-12"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-pink-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Blood Pressure Measurements */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="systolic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-pink-100 text-sm font-medium">
                            Sistólica (mmHg)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="120"
                              className="bg-zinc-950/50 border-pink-900/40 text-white placeholder:text-zinc-500 focus-visible:border-pink-500 focus-visible:ring-pink-500/20 transition-all duration-300 h-14 text-2xl font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-pink-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="diastolic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-pink-100 text-sm font-medium">
                            Diastólica (mmHg)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="80"
                              className="bg-zinc-950/50 border-pink-900/40 text-white placeholder:text-zinc-500 focus-visible:border-pink-500 focus-visible:ring-pink-500/20 transition-all duration-300 h-14 text-2xl font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-pink-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status indicator */}
                  {status && (
                    <div
                      className={`p-3 rounded-xl ${status.bg} border border-current/20 animate-fade-in`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-xs font-medium">
                          Classificação:
                        </span>
                        <span
                          className={`text-sm font-semibold ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reference ranges info */}
                <div className="bg-zinc-950/30 border border-zinc-800/50 rounded-xl p-4">
                  <p className="text-zinc-400 text-xs font-medium mb-2">
                    Valores de referência:
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">Normal</span>
                      <span className="text-green-400 text-xs font-semibold">
                        &lt; 120/80 mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">Elevada</span>
                      <span className="text-yellow-400 text-xs font-semibold">
                        120-129/&lt;80 mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">
                        Hipertensão Estágio 1
                      </span>
                      <span className="text-orange-400 text-xs font-semibold">
                        130-139/80-89 mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">
                        Hipertensão Estágio 2
                      </span>
                      <span className="text-red-400 text-xs font-semibold">
                        ≥140/≥90 mmHg
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 text-xs">
                        Crise Hipertensiva
                      </span>
                      <span className="text-red-500 text-xs font-semibold">
                        ≥180/≥120 mmHg
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
                  className="w-full h-12 bg-linear-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/30 transition-all duration-300 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
