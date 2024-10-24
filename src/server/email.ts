import { Resend } from "resend"

import { emailRenderer, EmailTemplates } from "@/components/email-renderer"
import { db } from "@/server/db"

export async function sendEmail({
  to,
  subject,
  template,
  data,
}: {
  to: string
  subject: string
  template: EmailTemplates
  data: object
}): Promise<void> {
  const body = await emailRenderer({ template, data })
  if (body === null) {
    throw new Error("Invalid email template")
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: `HHN <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: body,
  })
}

export function verifyEmailInput(email: string): boolean {
  return /^.+@.+\..+$/.test(email) && email.length < 256
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const row = await db.user.findUnique({
    where: { email },
  })
  if (row === null) {
    return true
  }
  return false
}
