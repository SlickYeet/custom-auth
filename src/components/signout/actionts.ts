"use server"

import { redirect } from "next/navigation"

import {
  deleteSessionTokenCookie,
  getSession,
  invalidateSession,
} from "@/server/auth/session"

interface ActionResult {
  message: string
}

export async function signOut(): Promise<ActionResult> {
  const { session } = await getSession()
  if (session === null) {
    return { message: "Not authenticated" }
  }

  await invalidateSession(session.id)
  deleteSessionTokenCookie()

  return redirect("/signin")
}
