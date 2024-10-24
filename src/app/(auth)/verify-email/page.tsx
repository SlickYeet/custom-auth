import Link from "next/link"
import { redirect } from "next/navigation"

import { getSession } from "@/server/auth/session"
import { getUserEmailVerificationRequestFromRequest } from "@/server/email-verification"

import {
  EmailVerificationForm,
  ResendEmailVerificationCodeForm,
} from "./components"

export default async function VerifyEmailPage() {
  const { user } = await getSession()
  if (user === null) {
    return redirect("/signin")
  }

  const verificationRequest = await getUserEmailVerificationRequestFromRequest()
  if (verificationRequest === null && user.emailVerified) {
    return redirect("/")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Verify your email address</h1>

      <div className="my-4 flex flex-col items-center gap-y-2">
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to {verificationRequest?.email ?? user.email}.
        </p>

        <EmailVerificationForm />

        <div className="flex w-full items-center justify-between">
          <ResendEmailVerificationCodeForm />
          <Link href="/settings" className="text-xs text-blue-500 underline">
            Change your email
          </Link>
        </div>
      </div>
    </div>
  )
}
