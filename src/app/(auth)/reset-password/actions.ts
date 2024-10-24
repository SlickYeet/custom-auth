"use server"

import { redirect } from "next/navigation"

import { verifyPasswordStrength } from "@/server/auth/password"
import {
  deletePasswordResetSessionTokenCookie,
  invalidateUserPasswordResetSessions,
  validatePasswordResetSessionRequest,
} from "@/server/auth/password-reset"
import { invalidateUserSessions } from "@/server/auth/session"
import { updateUserPassword } from "@/server/auth/user"
import { compare } from "bcrypt"

export async function resetPassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session: passwordResetSession, user } =
    await validatePasswordResetSessionRequest()
  if (passwordResetSession === null) {
    return { message: "Invalid session" }
  }
  if (!passwordResetSession.emailVerified) {
    return { message: "Email not verified" }
  }

  const password = formData.get("new_password")
  const passwordConfirmation = formData.get("new_password_confirmation")
  if (
    typeof password !== "string" ||
    typeof passwordConfirmation !== "string"
  ) {
    return { message: "Invalid password" }
  }
  if (password !== passwordConfirmation) {
    return { message: "Passwords do not match" }
  }

  const passwordMatches = await compare(password, user.password)
  if (passwordMatches) {
    return {
      message: "Your new password cannot be the same as your old password",
    }
  }

  const strongPassword = await verifyPasswordStrength(password)
  if (!strongPassword) {
    return { message: "Weak password" }
  }

  await invalidateUserPasswordResetSessions(passwordResetSession.userId)
  await invalidateUserSessions(passwordResetSession.userId)
  await updateUserPassword(passwordResetSession.userId, password)

  deletePasswordResetSessionTokenCookie()

  return redirect("/signin")
}

interface ActionResult {
  message: string
}
