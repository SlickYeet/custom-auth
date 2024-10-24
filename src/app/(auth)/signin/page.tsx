import Link from "next/link"
import { redirect } from "next/navigation"

import { getSession } from "@/server/auth/session"

import { SignInForm } from "./components"

export default async function SignInPage() {
  const { session, user } = await getSession()
  if (session !== null) {
    if (!user.emailVerified) {
      return redirect("/verify-email")
    }
    return redirect("/")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignInForm />

      <div className="flex flex-col items-center justify-between gap-y-2">
        <Link href="/signup" className="text-xs text-blue-500 underline">
          Create an account
        </Link>
        <Link
          href="/forgot-password"
          className="text-xs text-blue-500 underline"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}
