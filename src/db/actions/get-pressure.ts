"use server";

import { desc } from "drizzle-orm";
import { db } from "../client";
import { pressure } from "../schema";

export async function getPressure(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db.query.pressure.findMany({
    where: (table, { and, eq, gte, lte }) =>
      and(
        eq(table.userId, userId),
        gte(table.timestamp, startDate),
        lte(table.timestamp, endDate),
      ),
    orderBy: [desc(pressure.timestamp)],
  });
}
