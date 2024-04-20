"use client";

import { FormError } from "@/components/FormError";
import { useCurrentRole } from "@/hook/useCurrentRole";
import { UserRole } from "@prisma/client";
import { ReactNode } from "react";

interface RoleGateProps {
  children: ReactNode;
  allowedRole: UserRole;
}

export function RoleGate({ allowedRole, children }: RoleGateProps) {
  const currentUserRole = useCurrentRole();

  if (currentUserRole === allowedRole) {
    return children;
  }

  return <FormError message="You can't view this content" />;
}
