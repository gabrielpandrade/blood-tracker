"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { registerPressure } from "@/lib/api/pressure";
import { type FormData, formSchema } from "./pressure-schema";

interface Props {
  defaultDate: string;
  defaultTime: string;
}

export default function RegisterPressureForm({
  defaultDate,
  defaultTime,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultDate,
      time: defaultTime,
      systolic: "",
      diastolic: "",
    },
  });

  const systolic = form.watch("systolic");
  const diastolic = form.watch("diastolic");
  const status = getPressureStatus(systolic, diastolic);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registerPressure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pressure"] });

      setSuccessMessage("Pressão arterial registrada com sucesso!");
      setTimeout(() => router.push("/"), 1500);
    },
    onError: (error: Error) => {
      console.error(error);
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setSuccessMessage("");

    try {
      const timestamp = new Date(`${data.date}T${data.time}`);

      mutation.mutate(
        {
          systolic: Number(data.systolic),
          diastolic: Number(data.diastolic),
          timestamp,
        },
        {
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );

      setSuccessMessage("Pressão arterial registrada com sucesso!");
      setTimeout(() => router.push("/"), 1500);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                <span className={`text-sm font-semibold ${status.color}`}>
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
              <span className="text-zinc-500 text-xs">Crise Hipertensiva</span>
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
  );
}

function getPressureStatus(systolic: string, diastolic: string) {
  const sys = Number(systolic);
  const dia = Number(diastolic);

  if (!sys || !dia || Number.isNaN(sys) || Number.isNaN(dia)) return null;

  if (sys < 120 && dia < 80)
    return { text: "Normal", color: "text-green-400", bg: "bg-green-500/10" };

  if (sys < 130 && dia < 80)
    return {
      text: "Elevada",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    };

  if (sys < 140 || dia < 90)
    return {
      text: "Hipertensão Estágio 1",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    };

  if (sys < 180 || dia < 120)
    return {
      text: "Hipertensão Estágio 2",
      color: "text-red-400",
      bg: "bg-red-500/10",
    };

  return {
    text: "Crise Hipertensiva",
    color: "text-red-500",
    bg: "bg-red-600/20",
  };
}
