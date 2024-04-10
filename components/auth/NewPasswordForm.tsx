"use client";

import { updateUserPassword } from "@/actions/updateUserPassword";
import { NewPasswordFormValues } from "@/schemas";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { Button } from "../ui/Button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/Form";
import { Input } from "../ui/Input";
import { CardWrapper } from "./CardWrapper";

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const form = useForm<NewPasswordFormValues>({
    defaultValues: {
      password: "",
    },
  });

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const onSubmit = useCallback(
    async (values: NewPasswordFormValues) => {
      const resetPasswordToken = searchParams.get("token");

      try {
        const result = await updateUserPassword(values, resetPasswordToken);
        if (result.error) {
          setError(result.error);
        }
        if (result.success) {
          setSuccess(result.success);
        }
      } catch (error) {
        setError("Something went wrong");
      }
    },
    [searchParams]
  );

  return (
    <CardWrapper
      headerLabel="Enter new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="******" type="password" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full">
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
