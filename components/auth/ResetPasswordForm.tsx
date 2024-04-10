"use client";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordFormValues, ResetSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { resetPassword } from "@/actions/resetPassword";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

export default function ResetPasswordForm() {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const { error, success } = await resetPassword(values);
    success && setSuccess(success);
    error && setError(error);
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="john.doe@example.com" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button disabled={isPending} type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
