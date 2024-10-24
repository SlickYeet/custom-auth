import { redirect } from "next/navigation"

import { validatePasswordResetSessionRequest } from "@/server/auth/password-reset"

import { PasswordResetEmailVerificationForm } from "./components"

export default async function VerifyPasswordResetEmailPage() {
  const { session } = await validatePasswordResetSessionRequest()
  if (session === null) {
    return redirect("/forgot-password")
  }
  if (session.emailVerified) {
    return redirect("/reset-password")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Verify your email address</h1>

      <div className="my-4 flex flex-col items-center gap-y-2">
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to {session.email}.
        </p>

        <PasswordResetEmailVerificationForm />
      </div>
    </div>
  )
}
