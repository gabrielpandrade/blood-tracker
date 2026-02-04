/* biome-ignore-all lint/a11y/noSvgWithoutTitle: _ */
/* biome-ignore-all lint/suspicious/noArrayIndexKey: _ */
/* biome-ignore-all lint/a11y/useButtonType: _ */
"use client";

import { useQuery } from "@tanstack/react-query";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ChevronLeftIcon, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchGlucose, type GetGlucoseResponse } from "@/lib/api/glucose";
import { fetchPressure, type GetPressureResponse } from "@/lib/api/pressure";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* PDF */
/* -------------------------------------------------------------------------- */

async function exportToPDF(
  glucoseData: GlucoseRecord[],
  pressureData: PressureRecord[],
) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Relatório de Saúde - Blood Tracker", 14, 20);
  doc.setFontSize(12);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 30);

  doc.setFontSize(14);
  doc.text("Registros de Glicemia", 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [["Data/Hora", "Valor", "Status"]],
    body: glucoseData.map((g) => [
      new Date(g.timestamp).toLocaleString("pt-BR"),
      `${g.glucose} mg/dL`,
      g.glucose < 70 ? "Baixa" : g.glucose > 140 ? "Alta" : "Normal",
    ]),
  });

  // @ts-expect-error
  const finalY = doc.lastAutoTable?.finalY ?? 50;

  doc.text("Registros de Pressão Arterial", 14, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Data/Hora", "Medição", "Status"]],
    body: pressureData.map((p) => [
      new Date(p.timestamp).toLocaleString("pt-BR"),
      `${p.systolic}/${p.diastolic} mmHg`,
      p.systolic >= 140 || p.diastolic >= 90 ? "Elevada" : "Normal",
    ]),
  });

  doc.save("relatorio-saude.pdf");
}

/* -------------------------------------------------------------------------- */
/* MINI CHART */
/* -------------------------------------------------------------------------- */

function MiniChart({
  data,
  type,
}: {
  data: GlucoseRecord[] | PressureRecord[];
  type: "glucose" | "pressure";
}) {
  if (data.length === 0) return <div className="h-16" />;

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
              }`}
              style={{ height: `${height}%` }}
            />
          );
        })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN */
/* -------------------------------------------------------------------------- */

export default function ReportClient() {
  const PAGE_SIZE = 5;

  /* ------------------------------------------------------------------------ */
  /* STATE */
  /* ------------------------------------------------------------------------ */

  const [glucoseList, setGlucoseList] = useState<GlucoseRecord[]>([]);
  const [pressureList, setPressureList] = useState<PressureRecord[]>([]);

  const [glucoseCursor, setGlucoseCursor] = useState<{
    timestamp: Date;
    id: number;
  } | null>(null);

  const [pressureCursor, setPressureCursor] = useState<{
    timestamp: Date;
    id: number;
  } | null>(null);

  const [startDate] = useState("");
  const [endDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* GLICOSE */
  /* ------------------------------------------------------------------------ */

  const {
    data: glucoseResponse,
    isFetching: isFetchingGlucose,
    refetch: refetchGlucose,
  } = useQuery({
    queryKey: ["glucose", glucoseCursor, startDate, endDate],
    queryFn: async (): Promise<GetGlucoseResponse> =>
      fetchGlucose({
        pageSize: PAGE_SIZE,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        cursor: glucoseCursor ?? undefined,
      }),
  });

  useEffect(() => {
    if (!glucoseResponse) return;

    setGlucoseList((prev) =>
      glucoseCursor ? [...prev, ...glucoseResponse.data] : glucoseResponse.data,
    );

    setGlucoseCursor(glucoseResponse.pageInfo.nextCursor);
  }, [glucoseResponse, glucoseCursor]);

  /* ------------------------------------------------------------------------ */
  /* PRESSÃO */
  /* ------------------------------------------------------------------------ */

  const {
    data: pressureResponse,
    isFetching: isFetchingPressure,
    refetch: refetchPressure,
  } = useQuery({
    queryKey: ["pressure", pressureCursor, startDate, endDate],
    queryFn: async (): Promise<GetPressureResponse> =>
      fetchPressure({
        pageSize: PAGE_SIZE,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        cursor: pressureCursor ?? undefined,
      }),
  });

  useEffect(() => {
    if (!pressureResponse) return;

    setPressureList((prev) =>
      pressureCursor
        ? [...prev, ...pressureResponse.data]
        : pressureResponse.data,
    );

    setPressureCursor(pressureResponse.pageInfo.nextCursor);
  }, [pressureResponse, pressureCursor]);

  /* ------------------------------------------------------------------------ */
  /* HELPERS */
  /* ------------------------------------------------------------------------ */

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(date));

  const getGlucoseStatus = (v: number) => {
    if (v < 70) return { text: "Baixa", color: "text-yellow-400" };
    if (v <= 140) return { text: "Normal", color: "text-green-400" };
    if (v <= 180) return { text: "Atenção", color: "text-orange-400" };
    return { text: "Alta", color: "text-red-400" };
  };

  /* ------------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 pb-10">
      {/* HEADER */}
      <div className="flex items-center gap-4 pt-8 pb-6">
        <Button
          asChild
          variant="ghost"
          className="w-10 h-10 rounded-xl bg-zinc-900/60 border border-blue-500/30 hover:bg-zinc-800/60"
        >
          <Link href="/">
            <ChevronLeftIcon className="w-5 h-5 text-blue-400" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">Relatório</h1>
          <p className="text-zinc-400 text-sm">Histórico de medições</p>
        </div>

        <Button
          onClick={async () => {
            setIsExporting(true);
            await exportToPDF(glucoseList, pressureList);
            setIsExporting(false);
          }}
          disabled={isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* GLICEMIA */}
      <h2 className="text-zinc-300 mb-3">Glicemia</h2>

      <div className="bg-zinc-900/60 rounded-xl overflow-hidden mb-6">
        <div className="p-4 border-b border-zinc-800">
          <MiniChart data={glucoseList} type="glucose" />
        </div>

        {glucoseList.map((r) => {
          const status = getGlucoseStatus(r.glucose);
          return (
            <div key={r.id} className="p-4 border-b border-zinc-800">
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-semibold">{r.glucose} mg/dL</p>
                  <p className="text-xs text-zinc-500">
                    {formatDate(r.timestamp)}
                  </p>
                </div>
                <span className={`text-xs ${status.color}`}>{status.text}</span>
              </div>
            </div>
          );
        })}

        {glucoseResponse?.pageInfo.hasNextPage && (
          <div className="p-4">
            <Button
              onClick={() => refetchGlucose()}
              disabled={isFetchingGlucose}
              className="w-full"
            >
              {isFetchingGlucose ? "Carregando..." : "Ver mais"}
            </Button>
          </div>
        )}
      </div>

      {/* PRESSÃO */}
      <h2 className="text-zinc-300 mb-3">Pressão Arterial</h2>

      <div className="bg-zinc-900/60 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <MiniChart data={pressureList} type="pressure" />
        </div>

        {pressureList.map((r) => (
          <div key={r.id} className="p-4 border-b border-zinc-800">
            <div className="flex justify-between">
              <div>
                <p className="text-white font-semibold">
                  {r.systolic}/{r.diastolic} mmHg
                </p>
                <p className="text-xs text-zinc-500">
                  {formatDate(r.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {pressureResponse?.pageInfo.hasNextPage && (
          <div className="p-4">
            <Button
              onClick={() => refetchPressure()}
              disabled={isFetchingPressure}
              className="w-full"
            >
              {isFetchingPressure ? "Carregando..." : "Ver mais"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
