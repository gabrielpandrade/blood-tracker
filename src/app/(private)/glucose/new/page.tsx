/** biome-ignore-all lint/suspicious/noArrayIndexKey: _*/

import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import RegisterGlucoseForm from "./register-glucose-form";
import { ChevronLeftIcon } from "lucide-react";

export default async function RegisterGlucosePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Background */}
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

      <div className="absolute inset-0 bg-linear-to-b from-red-950/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              asChild
              variant="ghost"
              className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-red-900/30 hover:bg-zinc-800/60"
            >
              <Link href="/">
                <ChevronLeftIcon className="w-5 h-5 text-red-400" />
              </Link>
            </Button>

            <div>
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
            <RegisterGlucoseForm />
          </div>
        </div>
      </div>
    </div>
  );
}
