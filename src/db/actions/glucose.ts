import type { Glucose } from "@/types/glucose";
import { db } from "../client";

interface GetGlucoseParams {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  pageSize: number;
  cursor?: {
    timestamp: Date;
    id: number;
  } | null;
}

export async function getGlucoseData({
  userId,
  startDate,
  endDate,
  pageSize,
  cursor,
}: GetGlucoseParams): Promise<{
  data: Glucose[];
  pageInfo: {
    hasNextPage: boolean;
    nextCursor: {
      timestamp: Date;
      id: number;
    } | null;
  };
}> {
  const limit = pageSize + 1;

  const rows = await db.query.glucose.findMany({
    limit,
    orderBy: (glucose, { desc }) => [desc(glucose.timestamp), desc(glucose.id)],
    where: (glucose, { and, eq, gte, lte, lt }) =>
      and(
        eq(glucose.userId, userId),
        startDate ? gte(glucose.timestamp, startDate) : undefined,
        endDate ? lte(glucose.timestamp, endDate) : undefined,
        cursor ? lt(glucose.timestamp, cursor.timestamp) : undefined,
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
