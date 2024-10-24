import { sha1 } from "@oslojs/crypto/sha1"
import { encodeHexLowerCase } from "@oslojs/encoding"

export async function verifyPasswordStrength(
  password: string,
): Promise<boolean> {
  if (password.length < 10 || password.length > 255) {
    return false
  }

  const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)))
  const hashPrefix = hash.slice(0, 5)
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hashPrefix}`,
  )
  const data = await response.text()
  const items = data.split("\n")
  for (const item of items) {
    const hashSuffix = item.slice(0, 35).toLowerCase()
    if (hash === hashPrefix + hashSuffix) {
      return false
    }
  }

  return true
}
