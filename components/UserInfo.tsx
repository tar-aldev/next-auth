import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { User } from "next-auth";

interface UserInfoProps {
  user?: User;
  label: string;
}
export function UserInfo({ user, label }: UserInfoProps) {
  return (
    <Card className="min-w-[600px] shadow-md">
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>ID</p>
          <p className="truncate text-xs font-mono p-1 ">{user?.id}</p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Name</p>
          <p className="truncate text-xs font-mono p-1 ">{user?.name}</p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Email</p>
          <p className="truncate text-xs font-mono p-1">{user?.email}</p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Role </p>
          <p className="truncate text-xs font-mono p-1 ">{user?.role}</p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p>Two factor auth </p>
          <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
