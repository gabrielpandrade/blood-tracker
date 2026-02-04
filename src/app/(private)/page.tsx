import { headers } from "next/headers";
import { getLastPressure } from "@/db/actions/get-last-pressure";
import { getGlucoseData } from "@/db/actions/glucose";
import { auth } from "@/lib/auth";
import HomeClient from "./home-client";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const [{ data: lastGlucose }, lastPressure] = await Promise.all([
    getGlucoseData({
      userId: session.user.id,
      pageSize: 1,
    }),
    getLastPressure({ userId: session.user.id }),
  ]);

  return (
    <HomeClient
      user={session.user}
      initialLastGlucose={lastGlucose[0] ?? null}
      lastPressure={lastPressure}
    />
  );
}
