import type { Pressure } from "@/types/pressure";

interface GetLatestPressureResponse {
  data: Pressure[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: {
      timestamp: Date;
      id: number;
    } | null;
  };
}

export async function fetchLatestPressure(): Promise<Pressure | null> {
  const res = await fetch("/api/pressure?pageSize=1", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar glicemia");
  }

  const { data }: GetLatestPressureResponse = await res.json();

  return data[0] ?? null;
}
