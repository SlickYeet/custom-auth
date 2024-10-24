"use client"

import { useFormState } from "react-dom"

import { updateEmail, updatePassword, verifyEmail } from "./actions"

const initialUpdateEmailState = {
  message: "",
}

export function UpdateEmailForm({ emailVerified }: { emailVerified: boolean }) {
  const [updateEmailState, updateEmailAction] = useFormState(
    updateEmail,
    initialUpdateEmailState,
  )
  const [verifyEmailState, verifyEmailAction] = useFormState(
    verifyEmail,
    initialUpdateEmailState,
  )

  return (
    <form
      action={emailVerified ? updateEmailAction : verifyEmailAction}
      className="mt-4 flex flex-col gap-y-2"
    >
      {emailVerified ? (
        <div className="flex flex-col gap-y-1">
          <label className="text-xs">New email</label>
          <input
            type="email"
            name="email"
            placeholder="New email..."
            className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
          />
        </div>
      ) : null}

      <p className="text-xs text-red-500">{updateEmailState.message}</p>
      <p className="text-xs text-red-500">{verifyEmailState.message}</p>

      <button type="submit" className="w-full rounded-sm bg-blue-500 py-0.5">
        {emailVerified ? "Update email" : "Verify email"}
      </button>
    </form>
  )
}

const initialUpdatePasswordState = {
  message: "",
}

export function UpdatePasswordForm() {
  const [state, action] = useFormState(
    updatePassword,
    initialUpdatePasswordState,
  )

  return (
    <form action={action} className="mt-4 flex flex-col gap-y-2">
      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Current password</label>
        <input
          required
          type="password"
          name="password"
          placeholder="Current password..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

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

      <p
        className={`text-xs ${state.message === "Password updated" ? "text-green-500" : "text-red-500"} `}
      >
        {state.message}
      </p>

      <button type="submit" className="w-full rounded-sm bg-blue-500 py-0.5">
        Update password
      </button>
    </form>
  )
}
