import { type NextRequest, NextResponse } from "next/server";
import { getGlucoseData, registerGlucose } from "@/db/actions/glucose";
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

  const result = await getGlucoseData({
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
  const { glucose, timestamp } = body;

  if (typeof glucose !== "number") {
    return NextResponse.json(
      { error: "glucose deve ser um número" },
      { status: 400 },
    );
  }

  await registerGlucose({
    userId: session.user.id,
    glucose,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
  });

  return NextResponse.json(
    { success: true },
    { status: 201 },
  );
}
