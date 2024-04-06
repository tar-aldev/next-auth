import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "@/components/auth/CardWrapper";

export function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Oooops! Something went wrong"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex justify-center">
        <ExclamationTriangleIcon className="text-red-500" />
      </div>
    </CardWrapper>
  );
}
