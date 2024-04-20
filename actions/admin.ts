"use server";

import { getCurrentRole } from "@/lib/auth";

export async function admin() {
  const currentUserRole = await getCurrentRole();

  if (currentUserRole === "ADMIN") {
    return { success: "Allowed" };
  }

  return { error: "Forbidden" };
}
