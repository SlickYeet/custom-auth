import Link from "next/link"

import { getSession } from "@/server/auth/session"
import SignOutButton from "./signout"

export default async function Navbar() {
  const { user } = await getSession()

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-16 w-full backdrop-blur-lg">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">
          lucia auth
        </Link>

        <div className="flex items-center gap-x-4 text-sm">
          <Link href="/dashboard">Dashboard</Link>

          {user ? (
            <SignOutButton />
          ) : (
            <>
              <Link href="/signin">Sign In</Link>
              <Link
                href="/signup"
                className="rounded-md border border-neutral-500 p-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
