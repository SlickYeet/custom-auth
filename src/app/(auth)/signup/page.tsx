import Link from "next/link"

import { SignUpForm } from "./components"

export default function SignUp() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <SignUpForm />

      <Link href="/signin" className="text-xs text-blue-500 underline">
        Already have an account? Sign in here
      </Link>
    </div>
  )
}
