import type { Glucose } from "@/types/glucose";

interface GetLatestGlucoseResponse {
  data: Glucose[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: {
      timestamp: Date;
      id: number;
    } | null;
  };
}

export async function fetchLatestGlucose(): Promise<Glucose | null> {
  const res = await fetch("/api/glucose?pageSize=1", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar glicemia");
  }

  const { data }: GetLatestGlucoseResponse = await res.json();

  return data[0] ?? null;
}
