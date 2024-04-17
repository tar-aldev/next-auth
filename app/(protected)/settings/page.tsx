"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/hook/useCurrentUser";

export default function Settings() {
  const user = useCurrentUser();

  return (
    <div className="bg-white min-w-60 p-4 rounded-xl">
      <Button variant="default" onClick={() => logout()}>
        Sign out
      </Button>
    </div>
  );
}
