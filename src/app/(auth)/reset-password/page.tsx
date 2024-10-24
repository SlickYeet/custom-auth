import { redirect } from "next/navigation"

import { validatePasswordResetSessionRequest } from "@/server/auth/password-reset"

import { PasswordResetForm } from "./components"

export default async function ResetPasswordPage() {
  const { session } = await validatePasswordResetSessionRequest()
  if (session === null) {
    return redirect("/forgot-password")
  }
  if (!session.emailVerified) {
    return redirect("/reset-password/verify-email")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Enter your new password</h1>

      <PasswordResetForm />
    </div>
  )
}
