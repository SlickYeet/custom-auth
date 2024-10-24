import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

export const main = async () => {
  const password = await hash("Pass1234!", 12)
  const recoveryCode = "123456"

  const user = await prisma.user.create({
    data: {
      id: "999",
      name: "Test User",
      email: "test@famlam.ca",
      emailVerified: true,
      password,
    },
  })
  console.log({ user })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
