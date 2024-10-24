import Link from "next/link"
import { redirect } from "next/navigation"

import { getSession } from "@/server/auth/session"

export default async function DashboardPage() {
  const { user } = await getSession()
  if (!user?.emailVerified) {
    return redirect("/verify-email")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Dashboard</h1>

      <p className="mt-4 text-lg">
        {user ? (
          <span>
            Welcome back, <strong className="capitalize">{user.name}</strong>!
          </span>
        ) : (
          <span>You are not logged in.</span>
        )}
      </p>

      <Link
        href="/dashboard/settings"
        className="mt-4 text-xs text-blue-500 underline underline-offset-2"
      >
        Settings
      </Link>
    </div>
  )
}
