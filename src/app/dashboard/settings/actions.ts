"use server"

import { compare } from "bcrypt"
import { redirect } from "next/navigation"

import { verifyPasswordStrength } from "@/server/auth/password"
import {
  createSession,
  generateSessionToken,
  getSession,
  invalidateSession,
  setSessionTokenCookie,
} from "@/server/auth/session"
import { updateUserPassword } from "@/server/auth/user"
import { checkEmailAvailability, verifyEmailInput } from "@/server/email"
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/email-verification"

interface ActionResult {
  message: string
}

export async function updateEmail(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session, user } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  const email = formData.get("email")
  if (typeof email !== "string") {
    return { message: "Invalid email" }
  }
  if (email === "") {
    return { message: "Email cannot be empty" }
  }
  if (!verifyEmailInput(email)) {
    return { message: "Invalid email" }
  }

  const isEmailAvailable = await checkEmailAvailability(email)
  if (!isEmailAvailable) {
    return { message: "Email is already in use" }
  }

  const verificationRequest = await createEmailVerificationRequest(
    user.id,
    email,
  )
  await sendVerificationEmail(
    user.name,
    verificationRequest.email,
    verificationRequest.code,
  )
  setEmailVerificationRequestCookie(verificationRequest)

  return redirect("/verify-email")
}

export async function verifyEmail(): Promise<ActionResult> {
  const { session, user } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  if (user.emailVerified) {
    return { message: "Email is already verified" }
  }

  const verificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email,
  )
  await sendVerificationEmail(
    user.name,
    verificationRequest.email,
    verificationRequest.code,
  )
  setEmailVerificationRequestCookie(verificationRequest)

  return redirect("/verify-email")
}

export async function updatePassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session, user } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  const password = formData.get("password")
  const newPassword = formData.get("new_password")
  if (typeof password !== "string" || typeof newPassword !== "string") {
    return { message: "Invalid password" }
  }

  const strongPassword = await verifyPasswordStrength(newPassword)
  if (!strongPassword) {
    return { message: "Password is too weak" }
  }

  const validPassword = await compare(password, user.password)
  if (!validPassword) {
    return { message: "Incorrect password" }
  }

  await invalidateSession(session.id)
  await updateUserPassword(user.id, newPassword)

  const sessionToken = generateSessionToken()
  const newSession = await createSession(sessionToken, user.id)
  setSessionTokenCookie(sessionToken, newSession.expiresAt)

  return { message: "Password updated" }
}
