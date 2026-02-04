"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { registerGlucose } from "@/lib/api/glucose";
import { type FormData, formSchema } from "./glucose-schema";

export default function RegisterGlucoseForm() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      time: "",
      glucose: "",
    },
  });

  const glucoseValue = form.watch("glucose");

  const status = getGlucoseStatus(glucoseValue);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: registerGlucose,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["glucose"] });

      setSuccessMessage("Glicemia registrada com sucesso!");
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
          glucose: Number(data.glucose),
          timestamp,
        },
        {
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );

      setSuccessMessage("Glicemia registrada com sucesso!");

      setTimeout(() => router.push("/"), 1500);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const now = new Date();
    
    // Formata para o padrão que o <input /> aceita (YYYY-MM-DD e HH:mm)
    const datePart = now.toLocaleDateString('sv-SE'); // 'sv-SE' gera YYYY-MM-DD
    const timePart = now.toTimeString().slice(0, 5);

    form.reset({
      date: datePart,
      time: timePart,
      glucose: "",
    });
    
    setMounted(true);
  }, [form]);

  if (!mounted) return <div className="h-64 animate-pulse bg-zinc-900/20 rounded-2xl" />;

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
                      <span className={`text-xs font-semibold ${status.color}`}>
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
              <span className="text-zinc-500 text-xs"> Hipoglicemia </span>
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
              <span className="text-zinc-500 text-xs">Hiperglicemia</span>
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
  );
}

function getGlucoseStatus(value: string) {
  const glucose = Number(value);
  if (!glucose || Number.isNaN(glucose)) return null;

  if (glucose < 70)
    return { text: "Baixa", color: "text-yellow-400", bg: "bg-yellow-500/10" };

  if (glucose <= 140)
    return { text: "Normal", color: "text-green-400", bg: "bg-green-500/10" };

  if (glucose <= 180)
    return {
      text: "Atenção",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    };

  return { text: "Alta", color: "text-red-400", bg: "bg-red-500/10" };
}
