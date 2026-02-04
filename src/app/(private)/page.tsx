import { headers } from "next/headers";
import { getGlucoseData } from "@/db/actions/glucose";
import { getPressureData } from "@/db/actions/pressure";
import { auth } from "@/lib/auth";
import HomeClient from "./home-client";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const [{ data: lastGlucose }, { data: lastPressure }] = await Promise.all([
    getGlucoseData({
      userId: session.user.id,
      pageSize: 1,
    }),
    getPressureData({
      userId: session.user.id,
      pageSize: 1,
    }),
  ]);

  return (
    <HomeClient
      user={session.user}
      initialLastGlucose={lastGlucose[0] ?? null}
      initialLastPressure={lastPressure[0] ?? null}
    />
  );
}
