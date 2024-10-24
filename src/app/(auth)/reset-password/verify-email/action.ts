"use server"

import {
  setPasswordResetSessionAsEmailVerified,
  validatePasswordResetSessionRequest,
} from "@/server/auth/password-reset"
import { setUserAsEmailVerifiedIfEmailMatches } from "@/server/auth/user"
import { redirect } from "next/navigation"

export async function verifyPasswordResetEmail(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session } = await validatePasswordResetSessionRequest()
  if (session === null) {
    return { message: "Invalid session" }
  }
  if (session.emailVerified) {
    return { message: "Email already verified" }
  }

  const code = formData.get("code")
  if (typeof code !== "string") {
    return { message: "Invalid code" }
  }
  if (code === "") {
    return { message: "Code is required" }
  }
  if (code !== session.code) {
    return { message: "Incorrect code" }
  }

  await setPasswordResetSessionAsEmailVerified(session.id)
  const emailMatches = setUserAsEmailVerifiedIfEmailMatches(
    session.userId,
    session.email,
  )
  if (!emailMatches) {
    return { message: "Email does not match" }
  }

  return redirect("/reset-password")
}

interface ActionResult {
  message: string
}
