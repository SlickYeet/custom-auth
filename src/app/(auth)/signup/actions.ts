"use server"

import { redirect } from "next/navigation"

import { verifyPasswordStrength } from "@/server/auth/password"
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/server/auth/session"
import { createUser } from "@/server/auth/user"
import { checkEmailAvailability } from "@/server/email"
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/email-verification"

interface ActionResult {
  message: string
}

export async function signUp(_prev: ActionResult, formData: FormData) {
  const name = formData.get("name")
  const email = formData.get("email")
  const password = formData.get("password")
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { message: "Invalid or missing fields" }
  }

  const isEmailAvailable = await checkEmailAvailability(email)
  if (!isEmailAvailable) {
    return { message: "Email is already in use" }
  }

  const isPasswordStrong = await verifyPasswordStrength(password)
  if (!isPasswordStrong) {
    return { message: "Weak password" }
  }

  const user = await createUser(name, email, password)
  const emailVerification = await createEmailVerificationRequest(
    user.id,
    user.email,
  )
  sendVerificationEmail(
    user.name,
    emailVerification.email,
    emailVerification.code,
  )
  setEmailVerificationRequestCookie(emailVerification)

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)
  setSessionTokenCookie(sessionToken, session.expiresAt)

  return redirect("/verify-email")
}
