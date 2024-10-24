"use server"

import { compare } from "bcrypt"
import { redirect } from "next/navigation"

import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/server/auth/session"
import { db } from "@/server/db"

interface ActionResult {
  message: string
}

export async function SignIn(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = formData.get("email")
  const password = formData.get("password")

  if (typeof email !== "string" || typeof password !== "string") {
    return { message: "Invalid or missing fields" }
  }
  if (email === "" || password === "") {
    return { message: "Please enter your email and password" }
  }

  const user = await db.user.findUnique({
    where: { email },
  })
  if (user === null) {
    return { message: "Account does not exist" }
  }

  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) {
    return { message: "Invalid password" }
  }

  const sessionToken = generateSessionToken()
  const session = await createSession(sessionToken, user.id)
  setSessionTokenCookie(sessionToken, session.expiresAt)

  if (!user.emailVerified) {
    return redirect("/verify-email")
  }

  return redirect("/dashboard")
}
