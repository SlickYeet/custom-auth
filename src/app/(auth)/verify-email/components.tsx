"use client"

import { useFormState } from "react-dom"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { resendEmailVerificationCode, verifyEmail } from "./acionts"

const emailVerificationInitialState = {
  message: "",
}

export function EmailVerificationForm() {
  const [state, action] = useFormState(
    verifyEmail,
    emailVerificationInitialState,
  )

  return (
    <form action={action} className="flex flex-col gap-y-2">
      <InputOTP name="code" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <p className="text-xs text-red-500">{state.message}</p>

      <button type="submit" className="w-full rounded-sm bg-blue-500 py-0.5">
        Verify email
      </button>
    </form>
  )
}

const resendEmailInitialState = {
  message: "",
}

export function ResendEmailVerificationCodeForm() {
  const [state, action] = useFormState(
    resendEmailVerificationCode,
    resendEmailInitialState,
  )

  return (
    <form action={action} className="flex flex-col gap-y-2">
      <button type="submit" className="text-xs text-blue-500 underline">
        {state.message || "Resend code"}
      </button>
    </form>
  )
}
