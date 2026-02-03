"use server";

import { desc } from "drizzle-orm";
import { db } from "../client";
import { glucose } from "../schema"; 

export async function getGlucose(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db.query.glucose.findMany({
    where: (table, { and, eq, gte, lte }) =>
      and(
        eq(table.userId, userId),
        gte(table.timestamp, startDate),
        lte(table.timestamp, endDate),
      ),
    orderBy: [desc(glucose.timestamp)],
  });
}
