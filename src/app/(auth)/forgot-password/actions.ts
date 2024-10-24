"use server"

import { redirect } from "next/navigation"

import {
  createPasswordResetSession,
  invalidateUserPasswordResetSessions,
  sendPasswordResetEmail,
  setPasswordResetSessionTokenCookie,
} from "@/server/auth/password-reset"
import { generateSessionToken } from "@/server/auth/session"
import { db } from "@/server/db"
import { verifyEmailInput } from "@/server/email"

export async function forgotPassword(
  _prev: ActionResult,
  forData: FormData,
): Promise<ActionResult> {
  const email = forData.get("email")
  if (typeof email !== "string") {
    return { message: "Invalid email" }
  }
  if (!verifyEmailInput(email)) {
    return { message: "Invalid email" }
  }

  const user = await db.user.findUnique({
    where: { email },
  })
  if (user === null) {
    return { message: "User not found" }
  }

  await invalidateUserPasswordResetSessions(user.id)

  const sessionToken = generateSessionToken()
  const session = await createPasswordResetSession(sessionToken, user.id, email)

  await sendPasswordResetEmail(user.name, session.email, session.code)
  setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt)

  return redirect("/reset-password/verify-email")
}

interface ActionResult {
  message: string
}
