import { NewVerificationForm } from "@/components/auth/NewVerificationForm";

export default function NewVerificationPag({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return <NewVerificationForm />;
}
