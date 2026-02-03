"use server";

import { db } from "../client";

export async function getLastPressure({ userId }: { userId: string }) {
  return await db.query.pressure.findFirst({
    where: (glucose, { eq }) => eq(glucose.userId, userId),
    orderBy: (glucose, { desc }) => [desc(glucose.timestamp)],
  });
}
