"use client"

import { useFormState } from "react-dom"

import { forgotPassword } from "./actions"

const initialState = {
  message: "",
}

export function ForgotPasswordForm() {
  const [state, action] = useFormState(forgotPassword, initialState)

  return (
    <form action={action} className="mt-4 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <button type="submit" className="w-full rounded-sm bg-blue-500 py-0.5">
        Send reset email
      </button>

      <p className="text-xs text-red-500">{state.message}</p>
    </form>
  )
}
