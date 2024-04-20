import { auth } from "@/auth";
import { UserInfo } from "@/components/UserInfo";
import { getCurrentUser } from "@/lib/auth";

export default async function ServerPage() {
  const user = await getCurrentUser();

  return <UserInfo user={user} label="Server component" />;
}
