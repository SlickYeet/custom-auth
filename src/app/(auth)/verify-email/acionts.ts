"use server"

import { redirect } from "next/navigation"

import { getSession } from "@/server/auth/session"
import { updateUserEmailAndSetEmailAsVerified } from "@/server/auth/user"
import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/server/email-verification"

interface ActionResult {
  message: string
}

export async function verifyEmail(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { session, user } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest()
  if (verificationRequest === null) {
    return { message: "Invalid code" }
  }

  const code = formData.get("code")
  if (typeof code !== "string" || code.length !== 6) {
    return { message: "Invalid code" }
  }
  if (code === "") {
    return { message: "Code is required" }
  }
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createEmailVerificationRequest(
      verificationRequest.userId,
      verificationRequest.email,
    )
    await sendVerificationEmail(
      user.name,
      verificationRequest.email,
      verificationRequest.code,
    )
    return { message: "The code has expired. We sent you a new one." }
  }
  if (verificationRequest.code !== code) {
    return { message: "Invalid code" }
  }

  await deleteUserEmailVerificationRequest(user.id)
  // TODO: Implement password reset requests
  // TODO: Invalidate all password reset requests
  // await invalidateUserPasswordResetRequests(user.id)
  await updateUserEmailAndSetEmailAsVerified(user.id, verificationRequest.email)
  deleteEmailVerificationRequestCookie()

  return redirect("/dashboard")
}

export async function resendEmailVerificationCode(): Promise<ActionResult> {
  const { session, user } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest()
  if (verificationRequest === null) {
    if (user.emailVerified) {
      return { message: "Email is already verified" }
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email,
    )
  } else {
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      verificationRequest.email,
    )
  }

  await sendVerificationEmail(
    user.name,
    verificationRequest.email,
    verificationRequest.code,
  )
  setEmailVerificationRequestCookie(verificationRequest)

  return { message: "We sent you a new code" }
}
