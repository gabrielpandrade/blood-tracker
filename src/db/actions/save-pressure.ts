"use server";

import { db } from "../client";
import { pressure } from "../schema";

export async function savePressure({
  userId,
  timestamp,
  sistolica,
  diastolica,
}: {
  userId: string;
  timestamp: Date;
  sistolica: number;
  diastolica: number;
}) {
  await db.transaction(async (tx) => {
    await tx.insert(pressure).values({
      timestamp: timestamp,
      userId: userId,
      systolic: sistolica,
      diastolic: diastolica,
    });
  });
}
