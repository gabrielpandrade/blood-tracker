import { type NextRequest, NextResponse } from "next/server";
import { getPressureData, registerPressure } from "@/db/actions/pressure";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const userId = session.user.id;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const pageSize = searchParams.get("pageSize");
  const cursor = searchParams.get("cursor");

  if (!pageSize) {
    return NextResponse.json(
      { error: "pageSize é obrigatório" },
      { status: 400 },
    );
  }

  const result = await getPressureData({
    userId,
    pageSize: Number(pageSize),
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    cursor: cursor ? JSON.parse(cursor) : undefined,
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { systolic, diastolic, timestamp } = body;

  if (typeof systolic !== "number" || typeof diastolic !== "number") {
    return NextResponse.json(
      { error: "systolic e diastolic devem ser números" },
      { status: 400 },
    );
  }

  await registerPressure({
    userId: session.user.id,
    systolic,
    diastolic,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
