import { BadgeCheck } from "lucide-react"
import { redirect } from "next/navigation"

import { getSession } from "@/server/auth/session"

import { UpdateEmailForm, UpdatePasswordForm } from "./components"

export default async function SettingsPage() {
  const { session, user } = await getSession()
  if (session === null) {
    return redirect("/signin")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-2xl">Settings</h1>

      <div className="mt-4 flex gap-x-6">
        <section className="flex h-full w-[200px] flex-col justify-between">
          <div>
            <h2>Update email</h2>
            <p>Your email: </p>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{user.email}</p>
              {user.emailVerified ? (
                <BadgeCheck className="size-4 text-green-500" />
              ) : null}
            </div>
          </div>

          <UpdateEmailForm emailVerified={user.emailVerified} />
        </section>

        <section className="flex h-full w-[200px] flex-col justify-between">
          <h2>Update password</h2>

          <UpdatePasswordForm />
        </section>
      </div>
    </div>
  )
}
