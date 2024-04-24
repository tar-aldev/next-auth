"use client";

import { SettingsForm } from "@/app/(protected)/settings/components/SettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function Settings() {
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle className="text-center">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsForm />
      </CardContent>
    </Card>
  );
}
