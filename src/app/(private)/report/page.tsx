/** biome-ignore-all lint/a11y/noSvgWithoutTitle: _ */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
/** biome-ignore-all lint/a11y/useButtonType: _ */
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { redirect, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGlucose } from "@/db/actions/get-glucose";
import { getPressure } from "@/db/actions/get-pressure";
import { useSession } from "@/lib/auth-client";

// Mock types baseado no schema
type GlucoseRecord = {
  id: number;
  timestamp: Date;
  glucose: number;
  userId: string;
};

type PressureRecord = {
  id: number;
  timestamp: Date;
  systolic: number;
  diastolic: number;
  userId: string;
};

const handleGetGlucose = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<GlucoseRecord[]> => {
  return await getGlucose(userId, startDate, endDate);
};

const handlGetPressure = async (
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<PressureRecord[]> => {
  return await getPressure(userId, startDate, endDate);
};

const exportToPDF = async (
  glucoseData: GlucoseRecord[],
  pressureData: PressureRecord[],
) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Relatório de Saúde - Blood Tracker", 14, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30);

  // Tabela de Glicemia
  doc.setFontSize(14);
  doc.text("Registros de Glicemia", 14, 45);

  const glucoseRows = glucoseData.map((g) => [
    new Date(g.timestamp).toLocaleString("pt-BR"),
    `${g.glucose} mg/dL`,
    g.glucose < 70 ? "Baixa" : g.glucose > 140 ? "Alta" : "Normal",
  ]);

  autoTable(doc, {
    startY: 50,
    head: [["Data/Hora", "Valor", "Status"]],
    body: glucoseRows,
  });

  // Pega a posição Y final da tabela anterior
  // @ts-expect-error (o typescript pode reclamar da propriedade lastAutoTable)
  const finalY = doc.lastAutoTable.finalY || 50;

  // Tabela de Pressão
  doc.text("Registros de Pressão Arterial", 14, finalY + 15);

  const pressureRows = pressureData.map((p) => [
    new Date(p.timestamp).toLocaleString("pt-BR"),
    `${p.systolic}/${p.diastolic} mmHg`,
    p.systolic >= 140 || p.diastolic >= 90 ? "Elevada" : "Normal",
  ]);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Data/Hora", "Medição", "Status"]],
    body: pressureRows,
  });

  // Salvar o arquivo
  doc.save("relatorio-saude.pdf");
};

export default function ReportPage() {
  const router = useRouter();

  const { data: session } = useSession();

  if (!session) redirect("/");

  const userId = session.user.id;

  // Estados para dados
  const [glucoseData, setGlucoseData] = useState<GlucoseRecord[]>([]);
  const [pressureData, setPressureData] = useState<PressureRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Estados para filtro
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      let start: Date;
      let end: Date;

      // Se houver datas selecionadas no filtro, usa elas
      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
      } else {
        // CASO CONTRÁRIO: Define um padrão (ex: últimos 30 dias)
        const now = new Date();
        end = new Date(now);
        start = new Date(now);
        start.setDate(now.getDate() - 30);
      }

      // Ajusta o final do dia para pegar todos os registros até 23:59
      end.setHours(23, 59, 59, 999);
      // Ajusta o inicio do dia para 00:00 (opcional, mas recomendado)
      start.setHours(0, 0, 0, 0);

      const [glucose, pressure] = await Promise.all([
        handleGetGlucose(userId, start, end),
        handlGetPressure(userId, start, end),
      ]);

      setGlucoseData(glucose);
      setPressureData(pressure);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, startDate, endDate]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleFilter = async () => {
    if (!startDate || !endDate || !userId) return;

    setIsFiltering(true);
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Garante que pega até o último minuto do dia final

      const [glucose, pressure] = await Promise.all([
        handleGetGlucose(userId, start, end),
        handlGetPressure(userId, start, end),
      ]);

      setGlucoseData(glucose);
      setPressureData(pressure);
    } catch (error) {
      console.error("Erro ao filtrar:", error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    loadInitialData();
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF(glucoseData, pressureData);
    } catch (error) {
      console.error("Erro ao exportar:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getGlucoseStatus = (glucose: number) => {
    if (glucose < 70) return { text: "Baixa", color: "text-yellow-400" };
    if (glucose >= 70 && glucose <= 140)
      return { text: "Normal", color: "text-green-400" };
    if (glucose > 140 && glucose <= 180)
      return { text: "Atenção", color: "text-orange-400" };
    return { text: "Alta", color: "text-red-400" };
  };

  const getPressureStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80)
      return { text: "Normal", color: "text-green-400" };
    if (systolic >= 120 && systolic < 130 && diastolic < 80)
      return { text: "Elevada", color: "text-yellow-400" };
    if (
      (systolic >= 130 && systolic < 140) ||
      (diastolic >= 80 && diastolic < 90)
    )
      return { text: "Estágio 1", color: "text-orange-400" };
    return { text: "Estágio 2", color: "text-red-400" };
  };

  // Componente de mini gráfico simplificado
  const MiniChart = ({
    data,
    type,
  }: {
    data: GlucoseRecord[] | PressureRecord[];
    type: "glucose" | "pressure";
  }) => {
    const maxValue =
      type === "glucose"
        ? Math.max(...(data as GlucoseRecord[]).map((d) => d.glucose))
        : Math.max(...(data as PressureRecord[]).map((d) => d.systolic));

    return (
      <div className="h-16 flex items-end gap-1 px-2">
        {data
          .slice(0, 5)
          .reverse()
          .map((record, i) => {
            const value =
              type === "glucose"
                ? (record as GlucoseRecord).glucose
                : (record as PressureRecord).systolic;
            const height = (value / maxValue) * 100;

            return (
              <div
                key={i}
                className={`flex-1 rounded-t ${
                  type === "glucose" ? "bg-red-500/60" : "bg-pink-500/60"
                } transition-all duration-300 hover:opacity-80`}
                style={{ height: `${height}%` }}
              />
            );
          })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a]">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-15">
        {[
          { delay: "0s", duration: "10s", x: "5%", y: "15%" },
          { delay: "2s", duration: "14s", x: "80%", y: "65%" },
          { delay: "4s", duration: "12s", x: "20%", y: "85%" },
        ].map((cell, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 rounded-full bg-linear-to-br from-blue-500/60 to-blue-900/30 blur-3xl animate-float"
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
      <div className="absolute inset-0 bg-linear-to-b from-blue-950/10 via-transparent to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen pb-8">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-blue-900/30 flex items-center justify-center hover:bg-zinc-800/60 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <svg
                className="w-5 h-5 text-blue-400"
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
            <div className="animate-fade-in flex-1">
              <h1 className="text-2xl font-bold text-white">Relatório</h1>
              <p className="text-zinc-400 text-sm">Histórico de medições</p>
            </div>

            <Button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="h-10 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-sm">Exportando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm">Exportar PDF</span>
                </div>
              )}
            </Button>
          </div>

          {/* Date filter */}
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-blue-900/30 rounded-2xl p-4 animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label className="text-zinc-300 text-xs mb-1.5 block">
                  Data inicial
                </Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-zinc-950/50 border-blue-900/40 text-white h-10"
                />
              </div>
              <div className="flex-1">
                <Label className="text-zinc-300 text-xs mb-1.5 block">
                  Data final
                </Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-zinc-950/50 border-blue-900/40 text-white h-10"
                />
              </div>
              <div className="flex gap-2 items-end">
                <Button
                  onClick={handleFilter}
                  disabled={!startDate || !endDate || isFiltering}
                  className="h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  {isFiltering ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Filtrar"
                  )}
                </Button>
                {(startDate || endDate) && (
                  <Button
                    onClick={handleClearFilter}
                    variant="outline"
                    className="h-10 border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Glucose section */}
        <div className="px-6 mb-6">
          <h2 className="text-zinc-300 text-sm font-semibold mb-3 uppercase tracking-wider">
            Glicemia
          </h2>
          <div className="bg-zinc-900/60 backdrop-blur-xl border border-red-900/30 rounded-2xl overflow-hidden animate-slide-up">
            {/* Mini chart */}
            <div className="bg-zinc-950/30 border-b border-red-900/20 p-4">
              <MiniChart data={glucoseData} type="glucose" />
            </div>

            {/* List */}
            <div className="divide-y divide-zinc-800/50">
              {glucoseData.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-zinc-500 text-sm">
                    Nenhum registro encontrado
                  </p>
                </div>
              ) : (
                glucoseData.map((record) => {
                  const status = getGlucoseStatus(record.glucose);
                  return (
                    <div
                      key={record.id}
                      className="p-4 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-lg">
                            {record.glucose} mg/dL
                          </p>
                          <p className="text-zinc-500 text-xs">
                            {formatDate(record.timestamp)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Pressure section */}
        <div className="px-6">
          <h2 className="text-zinc-300 text-sm font-semibold mb-3 uppercase tracking-wider">
            Pressão Arterial
          </h2>
          <div
            className="bg-zinc-900/60 backdrop-blur-xl border border-pink-900/30 rounded-2xl overflow-hidden animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            {/* Mini chart */}
            <div className="bg-zinc-950/30 border-b border-pink-900/20 p-4">
              <MiniChart data={pressureData} type="pressure" />
            </div>

            {/* List */}
            <div className="divide-y divide-zinc-800/50">
              {pressureData.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-zinc-500 text-sm">
                    Nenhum registro encontrado
                  </p>
                </div>
              ) : (
                pressureData.map((record) => {
                  const status = getPressureStatus(
                    record.systolic,
                    record.diastolic,
                  );
                  return (
                    <div
                      key={record.id}
                      className="p-4 hover:bg-zinc-800/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold text-lg">
                            {record.systolic}/{record.diastolic} mmHg
                          </p>
                          <p className="text-zinc-500 text-xs">
                            {formatDate(record.timestamp)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold ${status.color}`}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
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
