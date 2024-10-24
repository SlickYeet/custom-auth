import Link from "next/link"

import { ForgotPasswordForm } from "./components"

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Forgot your password?</h1>

      <ForgotPasswordForm />

      <Link href="/signin" className="text-xs text-blue-500 underline">
        Sign in
      </Link>
    </div>
  )
}
