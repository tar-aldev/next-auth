"use server";
import { getUserByEmail } from "@/data/user";
import { ResetPasswordFormValues, ResetSchema } from "@/schemas";
import { sendResetPasswordEmail } from "../lib/mail";
import { generatePasswordResetToken } from "../lib/tokens";

export const resetPassword = async (formValues: ResetPasswordFormValues) => {
  try {
    const validatedFields = ResetSchema.safeParse(formValues);
    if (!validatedFields.success) {
      return { error: "Invalid email" };
    }
    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "Email not found" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendResetPasswordEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return { success: "Reset email sent" };
  } catch (error) {
    console.log("error", error);

    return { error: "Something went wrong" };
  }
};
