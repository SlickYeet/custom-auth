"use client"

import { useFormState } from "react-dom"

import { resetPassword } from "./actions"

const initialState = {
  message: "",
}

export function PasswordResetForm() {
  const [state, action] = useFormState(resetPassword, initialState)

  return (
    <form action={action} className="mt-4 flex w-[200px] flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <label className="text-xs">New password</label>
        <input
          required
          type="password"
          name="new_password"
          placeholder="New password..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Confirm new password</label>
        <input
          required
          type="password"
          name="new_password_confirmation"
          placeholder="Confirm new password..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <button type="submit" className="w-full rounded-sm bg-blue-500 py-0.5">
        Reset Password
      </button>

      <p
        className={`text-xs ${state.message === "Password updated" ? "text-green-500" : "text-red-500"} `}
      >
        {state.message}
      </p>
    </form>
  )
}
