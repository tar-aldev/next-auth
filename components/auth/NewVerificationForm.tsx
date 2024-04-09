"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { verifyToken } from "../../actions/newVerification";
import { CardWrapper } from "./CardWrapper";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";

export function NewVerificationForm() {
  const searchParams = useSearchParams();
  const verificationToken = searchParams.get("token");

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(async () => {
    if (!!success || !!error) return;

    try {
      const result = await verifyToken(verificationToken);
      if (result.error) {
        setError(result.error);
      }

      if (result.success) {
        setSuccess(result.success);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  }, [error, success, verificationToken]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  let content;
  if (!success && !error) {
    content = <BeatLoader loading speedMultiplier={0.6} />;
  } else {
    content = success ? (
      <FormSuccess message={success} />
    ) : (
      <FormError message={error} />
    );
  }

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex items-center w-full justify-center">{content}</div>
    </CardWrapper>
  );
}
