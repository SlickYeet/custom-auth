import { sha256 } from "@oslojs/crypto/sha2"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"
import type { Session, User } from "@prisma/client"
import { cookies } from "next/headers"
import { cache } from "react"

import { db } from "@/server/db"

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const row = await db.session.findFirst({
    where: { id: sessionId },
    include: { user: true },
  })
  if (row === null) {
    return { session: null, user: null }
  }

  const session: Session = {
    id: row.id,
    userId: row.userId,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt,
    updatedAt: row.createdAt,
  }
  const user: User = {
    id: row.user.id,
    name: row.user.name,
    email: row.user.email,
    emailVerified: row.user.emailVerified,
    password: row.user.password,
    createdAt: row.user.createdAt,
    updatedAt: row.user.updatedAt,
  }
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.session.delete({
      where: { id: session.id },
    })
    return { session: null, user: null }
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    await db.session.update({
      where: { id: session.id },
      data: { expiresAt: session.expiresAt },
    })
  }
  return { session, user }
}

export const getSession = cache(async (): Promise<SessionValidationResult> => {
  const token = cookies().get("session")?.value ?? null
  if (token === null) {
    return { session: null, user: null }
  }
  const result = await validateSessionToken(token)
  return result
})

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.session.delete({
    where: { id: sessionId },
  })
}

export async function invalidateUserSessions(userId: string): Promise<void> {
  await db.session.deleteMany({
    where: { userId },
  })
}

export function setSessionTokenCookie(token: string, expiresAt: Date): void {
  cookies().set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })
}

export function deleteSessionTokenCookie(): void {
  cookies().set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  })
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20)
  crypto.getRandomValues(tokenBytes)
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase()
  return token
}

export async function createSession(
  token: string,
  userId: string,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session = await db.session.create({
    data: {
      id: sessionId,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  })
  return session
}

type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }
