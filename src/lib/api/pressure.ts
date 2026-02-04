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

interface RegisterPressureInput {
  systolic: number;
  diastolic: number;
  timestamp?: Date;
}

export async function registerPressure(
  input: RegisterPressureInput,
): Promise<void> {
  const res = await fetch("/api/pressure", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systolic: input.systolic,
      diastolic: input.diastolic,
      timestamp: input.timestamp?.toISOString(),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Erro ao registrar pressão");
  }
}
