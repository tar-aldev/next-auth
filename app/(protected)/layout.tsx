import { Navbar } from "@/app/(protected)/settings/components/Navbar";
import { ReactElement } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 h-full w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
      <Navbar />
      {children}
    </div>
  );
}
