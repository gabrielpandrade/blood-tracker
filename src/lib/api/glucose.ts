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

export type GetGlucoseResponse = {
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

interface RegisterGlucoseInput {
  glucose: number;
  timestamp?: Date;
}

export async function registerGlucose(
  input: RegisterGlucoseInput,
): Promise<void> {
  const res = await fetch("/api/glucose", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      glucose: input.glucose,
      timestamp: input.timestamp?.toISOString(),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Erro ao registrar glicemia");
  }
}

interface FetchGlucoseParams {
  pageSize: number;
  startDate?: Date;
  endDate?: Date;
  cursor?: {
    timestamp: Date;
    id: number;
  };
}

export async function fetchGlucose(
  params: FetchGlucoseParams,
): Promise<GetLatestGlucoseResponse> {
  const searchParams = new URLSearchParams();

  // obrigatório
  searchParams.set("pageSize", params.pageSize.toString());

  // opcionais
  if (params.startDate) {
    searchParams.set("startDate", params.startDate.toISOString());
  }

  if (params.endDate) {
    searchParams.set("endDate", params.endDate.toISOString());
  }

  if (params.cursor) {
    searchParams.set(
      "cursor",
      JSON.stringify({
        timestamp: params.cursor.timestamp.toISOString(),
        id: params.cursor.id,
      }),
    );
  }

  const res = await fetch(`/api/glucose?${searchParams.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Erro ao buscar glicemia");
  }

  return res.json();
}

