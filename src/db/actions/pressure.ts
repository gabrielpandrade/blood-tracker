import type { Pressure } from "@/types/pressure";
import { db } from "../client";
import { pressure } from "../schema";

interface GetPressureParams {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  pageSize: number;
  cursor?: {
    timestamp: Date;
    id: number;
  } | null;
}

export async function getPressureData({
  userId,
  startDate,
  endDate,
  pageSize,
  cursor,
}: GetPressureParams): Promise<{
  data: Pressure[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: {
      timestamp: Date;
      id: number;
    } | null;
  };
}> {
  const limit = pageSize + 1;

  const rows = await db.query.pressure.findMany({
    limit,
    orderBy: (pressure, { desc }) => [desc(pressure.timestamp), desc(pressure.id)],
    where: (pressure, { and, eq, gte, lte, lt }) =>
      and(
        eq(pressure.userId, userId),
        startDate ? gte(pressure.timestamp, startDate) : undefined,
        endDate ? lte(pressure.timestamp, endDate) : undefined,
        cursor ? lt(pressure.timestamp, cursor.timestamp) : undefined,
      ),
  });

  const hasNextPage = rows.length > pageSize;
  const data = hasNextPage ? rows.slice(0, pageSize) : rows;

  const lastItem = data[data.length - 1];

  const nextCursor = lastItem
    ? {
        timestamp: lastItem.timestamp,
        id: lastItem.id,
      }
    : null;

  return {
    data,
    pageInfo: {
      hasNextPage,
      nextCursor,
    },
  };
}

interface RegisterPressureInput {
  userId: string;
  timestamp: Date;
  systolic: number;
  diastolic: number;
}

export async function registerPressure({
  userId,
  timestamp,
  systolic,
  diastolic,
}: RegisterPressureInput) {
  await db.insert(pressure).values({
    userId,
    timestamp,
    systolic,
    diastolic,
  });
}

