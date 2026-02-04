"use client";

import { redirect } from "next/navigation";
import Loading from "@/components/loading";
import { useSession } from "@/lib/auth-client";
import ReportClient from "./report-client";

export default function ReportPage() {
  const { data, isPending } = useSession();

  if (isPending) {
    return <Loading />;
  }

  if (!data?.user) {
    redirect("/");
  }

  return <ReportClient />;
}
