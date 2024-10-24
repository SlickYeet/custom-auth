import { sha256 } from "@oslojs/crypto/sha2"
import { encodeHexLowerCase } from "@oslojs/encoding"
import { User } from "@prisma/client"
import { cookies } from "next/headers"

import { generateOTP } from "@/lib/utils"
import { db } from "@/server/db"
import { sendEmail } from "@/server/email"

export async function createPasswordResetSession(
  token: string,
  userId: string,
  email: string,
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: PasswordResetSession = {
    id: sessionId,
    email,
    userId,
    emailVerified: false,
    code: generateOTP(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
  }
  await db.passwordResetSession.create({
    data: {
      id: session.id,
      email: session.email,
      emailVerified: session.emailVerified,
      code: session.code,
      userId: session.userId,
      expiresAt: session.expiresAt,
    },
  })
  return session
}

export async function validatePasswordResetSessionToken(
  token: string,
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const row = await db.passwordResetSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })
  if (row === null) {
    return { session: null, user: null }
  }

  const session: PasswordResetSession = {
    id: row.id,
    email: row.email,
    emailVerified: row.emailVerified,
    code: row.code,
    userId: row.userId,
    expiresAt: row.expiresAt,
  }
  const user: User = {
    id: row.user.id,
    email: row.user.email,
    emailVerified: row.user.emailVerified,
    name: row.user.name,
    password: row.user.password,
    createdAt: row.user.createdAt,
    updatedAt: row.user.updatedAt,
  }
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.passwordResetSession.delete({
      where: { id: session.id },
    })
    return { session: null, user: null }
  }
  return { session, user }
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string,
): Promise<void> {
  await db.passwordResetSession.update({
    where: { id: sessionId },
    data: { emailVerified: true },
  })
}

export async function invalidateUserPasswordResetSessions(
  userId: string,
): Promise<void> {
  await db.passwordResetSession.deleteMany({
    where: { userId },
  })
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
  const token = cookies().get("password_reset_session")?.value ?? null
  if (token === null) {
    return { session: null, user: null }
  }
  const result = await validatePasswordResetSessionToken(token)
  if (result.session === null) {
    deletePasswordResetSessionTokenCookie()
  }
  return result
}

export function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date,
): void {
  cookies().set("password_reset_session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })
}

export function deletePasswordResetSessionTokenCookie(): void {
  cookies().set("password_reset_session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}

export async function sendPasswordResetEmail(
  name: string,
  email: string,
  code: string,
): Promise<void> {
  await sendEmail({
    to: email,
    subject: "Reset your password",
    template: "password-reset-request",
    data: { name, code },
  })
}

export interface PasswordResetSession {
  id: string
  email: string
  emailVerified: boolean
  code: string
  userId: string
  expiresAt: Date
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null }
