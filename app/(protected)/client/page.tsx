"use client";
import { UserInfo } from "@/components/UserInfo";
import { useCurrentUser } from "@/hook/useCurrentUser";

export default function ClientPage() {
  const user = useCurrentUser();

  return <UserInfo user={user} label="Client component" />;
}
