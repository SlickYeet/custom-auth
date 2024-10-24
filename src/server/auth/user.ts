import { User } from "@prisma/client"
import { hash } from "bcrypt"

import { db } from "@/server/db"

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const passwordHash = await hash(password, 12)

  const user = await db.user.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  })
  if (user === null) {
    throw new Error("Unexpected error")
  }

  return user
}

export async function updateUserPassword(
  userId: string,
  password: string,
): Promise<void> {
  const passwordHash = await hash(password, 12)
  await db.user.update({
    where: { id: userId },
    data: { password: passwordHash },
  })
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: string,
  email: string,
): Promise<boolean> {
  const result = await db.user.update({
    where: { id: userId, email },
    data: { emailVerified: true },
  })
  return result !== null
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: string,
  email: string,
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { email, emailVerified: true },
  })
}
