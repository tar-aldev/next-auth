"use client";

import { admin } from "@/actions/admin";
import { FormSuccess } from "@/components/FormSuccess";
import { RoleGate } from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPage() {
  const { toast } = useToast();

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle className="text-center">Admin</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm">Admin only api route</p>
          <Button
            onClick={() => {
              fetch("/api/admin").then((res) => {
                if (res.ok) {
                  toast({
                    title: "Allowed",
                    description: "You are an admin and can do this api request",
                    variant: "success",
                  });
                } else {
                  toast({
                    title: "Not allowed",
                    description: "You can't do this api request",
                    variant: "destructive",
                  });
                }
              });
            }}
          >
            Click to test
          </Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm">Admin only server action</p>
          <Button
            onClick={async () => {
              const { success } = await admin();

              if (success) {
                toast({
                  title: "Allowed",
                  description: "You are an admin and can do this server action",
                  variant: "success",
                });
              } else {
                toast({
                  title: "Not allowed",
                  description: "You can't do this server action",
                  variant: "destructive",
                });
              }
            }}
          >
            Click to test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
