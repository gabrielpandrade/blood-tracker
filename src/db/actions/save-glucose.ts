"use server";

import { db } from "../client";
import { glucose } from "../schema";

export async function saveGlucose({
  userId,
  timestamp,
  glicemia,
}: {
  userId: string;
  timestamp: Date;
  glicemia: number;
}) {
  await db.transaction(async (tx) => {
    await tx.insert(glucose).values({
      timestamp: timestamp,
      userId: userId,
      glucose: glicemia
    });
  });
}
