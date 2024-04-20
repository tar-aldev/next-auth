import { getCurrentRole } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const currentUserRole = await getCurrentRole();

  if (currentUserRole === "ADMIN") {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
