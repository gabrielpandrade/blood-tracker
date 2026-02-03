"use server";

import { db } from "../client";

export async function getLastGlucose({ userId }: { userId: string }) {
  return await db.query.glucose.findFirst({
    where: (glucose, { eq }) => eq(glucose.userId, userId),
    orderBy: (glucose, { desc }) => [desc(glucose.timestamp)],
  });
}
